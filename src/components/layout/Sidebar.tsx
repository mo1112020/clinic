
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Dog, 
  Cat, 
  Bird, 
  Calendar, 
  FileText, 
  Search, 
  Package, 
  LayoutDashboard,
  PlusCircle,
  Activity
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: PlusCircle, label: 'New Patient', path: '/animals/new' },
    { icon: Search, label: 'Search Records', path: '/animals/search' },
    { icon: Dog, label: 'Dogs', path: '/animals/dogs' },
    { icon: Cat, label: 'Cats', path: '/animals/cats' },
    { icon: Bird, label: 'Birds', path: '/animals/birds' },
    { icon: Calendar, label: 'Vaccinations', path: '/vaccinations' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: FileText, label: 'Records', path: '/records' },
    { icon: Activity, label: 'Medical History', path: '/medical-history' },
  ];

  return (
    <div className="h-full flex flex-col bg-sidebar/80 backdrop-blur-lg border-r border-border">
      {/* Sidebar header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-canki p-2 rounded-xl">
            <Dog className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Canki</h1>
        </div>
      </div>
      
      {/* Sidebar content */}
      <div className="flex-1 px-4 pb-6 overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname === item.path
                  ? "bg-canki text-white shadow-sm"
                  : "text-foreground hover:bg-canki-muted hover:text-canki"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                location.pathname === item.path ? "text-white" : "text-muted-foreground"
              )} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Sidebar footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-canki-muted flex items-center justify-center">
            <span className="text-canki font-semibold">AV</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">Veterinarian</p>
          </div>
        </div>
      </div>
    </div>
  );
};

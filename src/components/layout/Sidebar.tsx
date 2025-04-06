import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Dog, 
  Cat, 
  Bird, 
  Calendar, 
  Search, 
  Package, 
  LayoutDashboard,
  PlusCircle,
  Activity,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { t } = useLanguage();
  
  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/' },
    { icon: PlusCircle, label: t('newPatient'), path: '/animals/new' },
    { icon: Search, label: t('searchRecords'), path: '/animals/search' },
    { icon: Dog, label: t('dogs'), path: '/animals/dogs' },
    { icon: Cat, label: t('cats'), path: '/animals/cats' },
    { icon: Bird, label: t('birds'), path: '/animals/birds' },
    { icon: Calendar, label: t('vaccinations'), path: '/vaccinations' },
    { icon: Package, label: t('inventory'), path: '/inventory' },
    { icon: Activity, label: t('medicalHistory'), path: '/medical-history' },
  ];

  const handleLogout = () => {
    logout();
  };

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-canki-muted flex items-center justify-center">
              <span className="text-canki font-semibold">AV</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">Veterinarian</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-md hover:bg-red-100 text-red-500 transition-colors duration-200"
            title={t('logout')}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

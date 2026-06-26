
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, ChevronDown, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/lib/AuthProvider';

const DashboardHeader: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthContext();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Guest';

  const getInitials = () => {
    if (!user) return 'G';
    if (user.displayName) {
      return user.displayName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user.email ? user.email[0].toUpperCase() : 'U';
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/feed')) return 'Feed';
    if (path.includes('/dr-summarizer')) return 'Dr Summarizer';
    if (path.includes('/data')) return 'Market Data';
    if (path.includes('/pricing')) return 'Pricing';
    if (path.includes('/help')) return 'Help';
    if (path.includes('/complaints')) return 'Complaints';
    return 'Dashboard';
  };

  return (
    <header className="w-full h-16 px-6 border-b border-gray-100 flex items-center justify-between bg-white">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#10B981]" size={18} />
          <Input
            type="text"
            placeholder="Search complaints, petitions..."
            className="w-full pl-10 pr-4 h-10 text-sm bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-[#10B981] placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" className="relative p-2 hover:bg-gray-50">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10B981] rounded-full" />
        </Button>

        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {user?.photoURL ? (
              <AvatarImage src={user.photoURL} referrerPolicy="no-referrer" />
            ) : (
              <AvatarFallback className="bg-[#10B981] text-white text-sm font-semibold">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-gray-700">{displayName}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

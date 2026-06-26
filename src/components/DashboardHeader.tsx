import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/lib/AuthProvider';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationPanel from '@/components/NotificationPanel';
import { useTranslation } from 'react-i18next';

const DashboardHeader: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthContext();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
    if (path === '/dashboard') return t('pageTitle.dashboard');
    if (path.includes('/settings')) return t('pageTitle.settings');
    if (path.includes('/feed')) return t('pageTitle.feed');
    if (path.includes('/dr-summarizer')) return t('pageTitle.drSummarizer');
    if (path.includes('/data')) return t('pageTitle.data');
    if (path.includes('/pricing')) return t('pageTitle.pricing');
    if (path.includes('/help')) return t('pageTitle.help');
    if (path.includes('/complaints')) return t('pageTitle.complaints');
    if (path.includes('/petition')) return t('pageTitle.petition');
    if (path.includes('/bus-fare')) return t('pageTitle.busFare');
    if (path.includes('/polls')) return t('pageTitle.polls');
    if (path.includes('/messaging')) return t('pageTitle.messaging');
    if (path.includes('/weather')) return t('pageTitle.weather');
    if (path.includes('/transactions')) return t('pageTitle.transactions');
    return t('pageTitle.dashboard');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  return (
    <header className="w-full h-16 px-6 border-b border-gray-100 flex items-center justify-between bg-white">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4" ref={bellRef}>
        <div className="relative">
          <Button
            variant="ghost"
            className="relative p-2 hover:bg-gray-50"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <Bell size={18} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
          {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
        </div>

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

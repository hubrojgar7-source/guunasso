import React, { useEffect, useState } from 'react';
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  LineChart,
  Vote,
  FileText,
  HelpCircle,
  ShieldAlert,
  Bus,
  ScrollText,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@/context/SidebarContext';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUserProfile';

export const AppSidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const [navigationItems, setNavigationItems] = useState<
    Array<{ title: string; url: string; icon: React.ElementType }>
  >([]);

  useEffect(() => {
    const allItems = [
      {
        title: t('common.dashboard'),
        url: '/dashboard',
        icon: BarChart3,
        showFor: ['farmer', 'user', 'admin'],
      },
      {
        title: t('common.complaints', 'Complaints'),
        url: '/dashboard/complaints',
        icon: ShieldAlert,
        showFor: ['farmer', 'user', 'admin'],
      },
      {
        title: t('sidebar.petition'),
        url: '/dashboard/petition',
        icon: ScrollText,
        showFor: ['farmer', 'user', 'admin'],
      },
      {
        title: t('sidebar.polls'),
        url: '/dashboard/polls',
        icon: Vote,
        showFor: ['farmer', 'user', 'admin'],
      },
      {
        title: t('common.drSummarizer', 'Dr Summarizer'),
        url: '/dashboard/dr-summarizer',
        icon: FileText,
        showFor: ['farmer', 'user'],
      },
      {
        title: t('sidebar.busFare'),
        url: '/dashboard/bus-fare',
        icon: Bus,
        showFor: ['farmer', 'user', 'admin'],
      },
      {
        title: t('common.data'),
        url: '/dashboard/data',
        icon: LineChart,
        showFor: ['farmer'],
      },
      {
        title: t('common.help'),
        url: '/dashboard/help',
        icon: HelpCircle,
        showFor: ['farmer', 'user', 'admin'],
      },
    ];

    const userType = profile?.userType || 'user';
    const filteredItems = allItems.filter((item) => item.showFor.includes(userType));
    setNavigationItems(filteredItems);
  }, [profile, t]);

  const isActive = (url: string) => {
    if (url === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(url);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success(t('common.signedOut'));
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(t('common.signOutError'));
    }
  };

  const handleContactUs = () => {
    navigate('/dashboard/help');
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-[110px]' : 'w-[280px]'
      } fixed top-0 left-0 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-200 z-30`}
    >
      <div className="absolute -right-3 top-6 z-40">
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:border-[#10B981] transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#10B981]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#10B981]" />
          )}
        </button>
      </div>

      <NavLink to="/dashboard" className="flex items-center px-6 h-16 flex-shrink-0 bg-white border-b border-gray-100">
        <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">ग</span>
        </div>
        <span
          className={`ml-3 text-xl font-bold tracking-tight transition-opacity duration-200 whitespace-nowrap ${
            isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 block'
          }`}
        >
          <span className="text-gray-900">गुनासो</span>
          <span className="text-[#10B981]">.com</span>
        </span>
      </NavLink>

      <div className="flex-1 overflow-y-auto pt-4 flex flex-col justify-between">
        <div>
          <nav className="px-3">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
                  } py-3 rounded-lg cursor-pointer transition-colors ${
                    isActive(item.url)
                      ? 'bg-[#10B981] text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={isCollapsed ? item.title : ''}
                >
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive(item.url) ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                  <span className={`text-sm font-medium ${isCollapsed ? 'hidden' : 'block'}`}>
                    {!isCollapsed && item.title}
                  </span>
                </NavLink>
              ))}
            </div>
          </nav>

          <div className={`p-4 mt-4 ${isCollapsed ? 'hidden' : 'block'}`}>
              <div className="bg-[#10B981] rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-white/90" />
                <span className="text-sm font-semibold">
                  {t('sidebar.support')}
                </span>
              </div>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">
                {t('sidebar.supportDesc')}
              </p>
              <Button
                className="w-full bg-white text-[#10B981] hover:bg-gray-50 rounded-lg text-sm font-semibold h-10 border-0 shadow-none"
                onClick={handleContactUs}
              >
                {t('sidebar.contactUs')}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-3 pb-6 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className={`flex items-center ${
              isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
            } py-3 text-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 w-full transition-colors`}
            title={isCollapsed ? t('common.signOut') : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-gray-400" />
            <span
              className={`text-sm font-medium transition-opacity duration-300 ${
                isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}
            >
              {!isCollapsed && t('common.signOut')}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

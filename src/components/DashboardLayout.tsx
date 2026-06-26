
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import ChatBot from '@/components/ChatBot';
import { useSidebar } from '@/context/SidebarContext';

const DashboardLayout = () => {
  const location = useLocation();
  const isWeather = location.pathname.includes('/weather');
  const isPolls = location.pathname.includes('/polls');
  const isBusFare = location.pathname.includes('/bus-fare');
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen flex w-full bg-white overflow-x-hidden">
      <AppSidebar />
      
      <div 
        className={`flex-1 flex flex-col ${isCollapsed ? 'ml-[110px]' : 'ml-[280px]'} transition-[margin] duration-200`}
        style={{ width: 'calc(100% - ' + (isCollapsed ? '110px' : '280px') + ')' }}
      >
        <DashboardHeader />
        <main className={`flex-1 relative ${
          isPolls
            ? 'scale-100 origin-top-left w-full'
            : isWeather 
            ? 'scale-75 origin-top-left w-[130%]' 
            : 'scale-90 origin-top-left w-[110%]'
        }`}>
          <Outlet />
        </main>
      </div>

      {/* ChatBot Component - hidden on Bus Fare page */}
      {!isBusFare && <ChatBot />}
    </div>
  );
};

export default DashboardLayout;

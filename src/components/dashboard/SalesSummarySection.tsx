
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Landmark, Receipt, CreditCard } from 'lucide-react';
import { VisitorInsightsChart } from './charts/VisitorInsightsChart';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatNumber } from '@/lib/formatters';

export const SalesSummarySection = () => {
  const { t } = useTranslation();
  
  const salesData = [
    {
      title: 'Complaints Today',
      value: 243,
      isCurrency: false,
      change: 5,
      icon: Wallet,
      bgColor: "bg-pink-100",
      iconColor: "text-white",
      circleBg: "bg-pink-400"
    },
    {
      title: 'Resolved Today',
      value: 189,
      isCurrency: false,
      change: 12,
      icon: Landmark,
      bgColor: "bg-orange-100",
      iconColor: "text-white",
      circleBg: "bg-orange-300"
    },
    {
      title: 'Active Petitions',
      value: 342,
      isCurrency: false,
      change: 8,
      icon: Receipt,
      bgColor: "bg-green-100",
      iconColor: "text-white",
      circleBg: "bg-green-400"
    },
    {
      title: 'Total Signatures',
      value: 28491,
      isCurrency: false,
      change: 18,
      icon: CreditCard,
      bgColor: "bg-purple-100",
      iconColor: "text-white",
      circleBg: "bg-purple-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Today's Overview */}
      <Card className="bg-white border border-gray-200/50 rounded-lg overflow-hidden shadow-sm h-full w-full relative">
        <CardHeader className="pb-0 px-3 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-zinc-900">Today's Overview</CardTitle>
            <button className="text-xs text-gray-600 border border-gray-100 rounded-md px-2 py-0.5 bg-gray-50 hover:bg-gray-100">
              View Report
            </button>
          </div>
          <p className="text-xs text-gray-600 mb-2">Summary of today's platform activity</p>
        </CardHeader>
        <CardContent className="absolute bottom-6 left-0 right-0 px-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {salesData.map((item, index) => {
              // Format value based on type (currency or regular number)
              const formattedValue = item.isCurrency 
                ? formatCurrency(item.value) 
                : formatNumber(item.value);
                
              return (
                <div key={index} className={`${item.bgColor} rounded-xl p-3 shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-full ${item.circleBg} flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-zinc-900 mb-0.5">{formattedValue}</div>
                  <div className="text-xs text-gray-600 mb-0.5">{t(item.title)}</div>
                  <div className="text-xs text-blue-600">+{item.change}% {t('dashboard.fromYesterday')}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Visitor Insights */}
      <VisitorInsightsChart />
    </div>
  );
};

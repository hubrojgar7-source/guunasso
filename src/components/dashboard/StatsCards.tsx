
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';

const statsData = [
  {
    titleKey: "stats.totalComplaints",
    value: 15682,
    change: 12,
    isPositive: true,
    isCurrency: false
  },
  {
    titleKey: "stats.resolvedComplaints",
    value: 12453,
    change: 8,
    isPositive: true,
    isCurrency: false
  },
  {
    titleKey: "stats.activePetitions",
    value: 342,
    change: 24,
    isPositive: true,
    isCurrency: false
  },
  {
    titleKey: "stats.totalSignatures",
    value: 28491,
    change: 36,
    isPositive: true,
    isCurrency: false
  }
];

export const StatsCards = () => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        // Format the value based on whether it's currency or a number
        const formattedValue = stat.isCurrency 
          ? formatCurrency(stat.value) 
          : formatNumber(stat.value);
        
        // Format the change percentage
        const formattedChange = formatPercent(Math.abs(stat.change));
        
        return (
          <Card key={index} className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 font-medium">{t(stat.titleKey)}</p>
                <span className={`text-xs font-medium flex items-center ${
                  stat.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-3 h-3 mr-1 ${!stat.isPositive ? 'rotate-180' : ''}`} />
                  {stat.isPositive ? '+' : '-'}{formattedChange}
                </span>
              </div>
              <div className="text-2xl font-bold text-zinc-900">{formattedValue}</div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};

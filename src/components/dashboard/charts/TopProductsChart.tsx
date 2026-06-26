import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const topComplaintCategories = [
  { id: '01', nameKey: 'complaintCategories.infrastructure', color: 'bg-blue-500', percentage: 35, count: 35 },
  { id: '02', nameKey: 'complaintCategories.health', color: 'bg-green-500', percentage: 25, count: 25 },
  { id: '03', nameKey: 'complaintCategories.education', color: 'bg-purple-500', percentage: 20, count: 20 },
  { id: '04', nameKey: 'complaintCategories.governance', color: 'bg-orange-500', percentage: 15, count: 15 },
];

export const TopProductsChart = () => {
  const { t } = useTranslation();
  
  const translatedData = topComplaintCategories.map(item => ({
    ...item,
    name: t(item.nameKey)
  }));
  
  return (
    <Card className="bg-white border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm h-full">
      <CardHeader className="pb-3 px-4 pt-4">
        <CardTitle className="text-lg font-semibold text-zinc-900">{t('chart.topComplaintCategories')}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-8">
        <div className="space-y-8">
          <div className="grid grid-cols-12 gap-4 text-sm text-gray-500 mb-6">
            <div className="col-span-1 font-medium">#</div>
            <div className="col-span-5 font-medium">{t('dashboard.name')}</div>
            <div className="col-span-4 font-medium">{t('dashboard.popularity')}</div>
            <div className="col-span-2 font-medium">{t('data.count')}</div>
          </div>
          {translatedData.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1">
                <span className="text-sm text-gray-700 font-medium">{item.id}</span>
              </div>
              <div className="col-span-5">
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <div className="col-span-4">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className={`${item.color} h-3 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
              <div className="col-span-2">
                <span className={`text-sm font-medium px-2 py-1 rounded text-white ${item.color}`}>
                  {item.count}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
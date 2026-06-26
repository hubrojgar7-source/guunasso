import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

const ministryData = [
  { name: 'Education', budget: 1079, color: '#3B82F6' },
  { name: 'Health', budget: 535, color: '#EF4444' },
  { name: 'Agriculture', budget: 745, color: '#22C55E' },
  { name: 'Defense', budget: 368, color: '#8B5CF6' },
  { name: 'Infrastructure', budget: 1640, color: '#F59E0B' },
  { name: 'Home Affairs', budget: 412, color: '#EC4899' },
  { name: 'Energy', budget: 286, color: '#14B8A6' },
  { name: 'Others', budget: 897, color: '#6B7280' },
];

export const CropYieldChart = () => {
  const { t } = useTranslation();
  return (
    <Card className="bg-white border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-zinc-900">{t('dashboard.minBudget')}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{t('dashboard.fiscalYear')}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4 flex-1 flex flex-col">
        <div className="w-full flex-1">
          <ResponsiveContainer width="99%" height={320}>
            <BarChart
              data={ministryData}
              margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
                width={40}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                formatter={(value: number) => [`Rs. ${value} Billion`, 'Budget']}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              />
              <Bar dataKey="budget" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {ministryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

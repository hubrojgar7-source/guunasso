import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

export const CropDistributionChart = () => {
  const { t } = useTranslation();

  const budgetData = [
    { name: 'Agriculture', value: 8.5, amount: 74500, color: '#22C55E' },
    { name: 'Education', value: 12.3, amount: 107900, color: '#3B82F6' },
    { name: 'Health', value: 6.1, amount: 53500, color: '#EF4444' },
    { name: 'Infrastructure', value: 18.7, amount: 164000, color: '#F59E0B' },
    { name: 'Defense', value: 4.2, amount: 36800, color: '#8B5CF6' },
    { name: t('dashboard.socialSecurity'), value: 15.4, amount: 135000, color: '#EC4899' },
    { name: t('dashboard.debtRepayment'), value: 8.9, amount: 78000, color: '#14B8A6' },
    { name: 'Other', value: 25.9, amount: 227300, color: '#6B7280' },
  ];

  const totalBudget = budgetData.reduce((s, d) => s + d.amount, 0);
  return (
    <Card className="bg-white border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg font-semibold text-zinc-900">{t('dashboard.budgetCategories')}</CardTitle>
          <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-md">
            {t('dashboard.total')}: Rs. {(totalBudget / 1000).toFixed(1)}B
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4 flex-1 flex flex-col">
        <ResponsiveContainer width="99%" height={280}>
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={budgetData}
              cx="50%" cy="50%"
              innerRadius={70} outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
              labelLine={false}
            >
              {budgetData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Share']}
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2">
          {budgetData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-gray-600">{entry.name}</span>
              <span className="text-xs font-semibold text-gray-900">Rs. {(entry.amount / 1000).toFixed(1)}B</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

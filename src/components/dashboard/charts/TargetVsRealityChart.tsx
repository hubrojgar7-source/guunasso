import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';

const revenueVsExpenditureData = [
  { month: 'months.jan', revenue: 25000, expenditure: 23300 },
  { month: 'months.feb', revenue: 26000, expenditure: 24900 },
  { month: 'months.mar', revenue: 27500, expenditure: 25800 },
  { month: 'months.apr', revenue: 28000, expenditure: 26900 },
  { month: 'months.may', revenue: 29500, expenditure: 27900 },
  { month: 'months.jun', revenue: 31000, expenditure: 28700 },
  { month: 'months.jul', revenue: 32500, expenditure: 29400 },
];

export const TargetVsRealityChart = () => {
  const { t } = useTranslation();

  // Translate month names
  const translatedData = revenueVsExpenditureData.map(item => ({
    ...item,
    translatedMonth: t(item.month)
  }));

  const [filter, setFilter] = useState<'week' | 'month' | 'year'>('month');

  const filterOptions: { key: 'week' | 'month' | 'year'; label: string }[] = [
    { key: 'week',  label: 'This Week'  },
    { key: 'month', label: 'This Month' },
    { key: 'year',  label: 'This Year'  },
  ];

  return (
    <Card className="bg-white border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg font-semibold text-zinc-900">{t('chart.targetVsReality')}</CardTitle>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'week' | 'month' | 'year')}
            className="text-sm border border-gray-100 rounded-md px-3 py-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <span className="text-xs text-gray-400 font-medium mt-1 inline-block">Amount in Lakh</span>
      </CardHeader>
      <CardContent className="px-2 pb-4 flex-1 flex flex-col">
        <ResponsiveContainer width="99%" height={260}>
          <BarChart 
            data={translatedData} 
            barCategoryGap={20}
            margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="translatedMonth" 
              axisLine={false} 
              tickLine={false} 
              className="text-sm text-gray-600"
              tick={{ fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              className="text-sm text-gray-600"
              tick={{ fontSize: 11 }}
              width={45}
              tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`${value} Lakh`, '']}
              labelFormatter={(label) => label}
            />
            <Bar 
              dataKey="revenue" 
              fill="#10b981" 
              name={t('dashboard.target')}
              radius={[2, 2, 0, 0]}
              barSize={15}
            />
            <Bar 
              dataKey="expenditure" 
              fill="#fbbf24" 
              name={t('dashboard.reality')}
              radius={[2, 2, 0, 0]}
              barSize={15}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '15px' }}
              iconType="circle"
              verticalAlign="bottom"
              height={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

type FilterType = 'week' | 'month' | 'year';

const weekData = [
  { label: '03-04', recurrent: 46215,  capital: 7699,   financing: 0 },
  { label: '03-05', recurrent: 21348,  capital: 9797,   financing: 0 },
  { label: '03-06', recurrent: 180,    capital: 7,      financing: 0 },
  { label: '03-07', recurrent: 996,    capital: 253,    financing: 0 },
  { label: '03-08', recurrent: 24323,  capital: 6937,   financing: 0 },
  { label: '03-09', recurrent: 20918,  capital: 10543,  financing: 39600 },
  { label: 'Today', recurrent: 180,    capital: 7,      financing: 0 },
];

const monthData = [
  { label: 'Week 1', recurrent: 22100, capital: 6200, financing: 0 },
  { label: 'Week 2', recurrent: 22800, capital: 6450, financing: 0 },
  { label: 'Week 3', recurrent: 23500, capital: 6700, financing: 0 },
  { label: 'Week 4', recurrent: 24323, capital: 6937, financing: 0 },
];

const yearData = [
  { label: 'Jan', recurrent: 18200, capital: 5100, financing: 0 },
  { label: 'Feb', recurrent: 19500, capital: 5400, financing: 0 },
  { label: 'Mar', recurrent: 20100, capital: 5700, financing: 0 },
  { label: 'Apr', recurrent: 21000, capital: 5900, financing: 0 },
  { label: 'May', recurrent: 21800, capital: 6100, financing: 0 },
  { label: 'Jun', recurrent: 22400, capital: 6300, financing: 0 },
  { label: 'Jul', recurrent: 22900, capital: 6500, financing: 0 },
  { label: 'Aug', recurrent: 23300, capital: 6600, financing: 0 },
  { label: 'Sep', recurrent: 23700, capital: 6700, financing: 0 },
  { label: 'Oct', recurrent: 24000, capital: 6800, financing: 0 },
  { label: 'Nov', recurrent: 24200, capital: 6900, financing: 0 },
  { label: 'Dec', recurrent: 24323, capital: 6937, financing: 0 },
];

const dataMap: Record<FilterType, typeof weekData> = {
  week: weekData,
  month: monthData,
  year: yearData,
};

export const VisitorInsightsChart = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>('week');
  const activeData = dataMap[filter];

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: 'week',  label: t('dashboard.thisWeek')  },
    { key: 'month', label: t('dashboard.thisMonth') },
    { key: 'year',  label: t('dashboard.thisYear')  },
  ];

  return (
    <Card className="bg-white border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm h-full">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg font-semibold text-zinc-900">{t('dashboard.expenditure')}</CardTitle>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="text-sm border border-gray-100 rounded-md px-3 py-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-400 mt-1">Amount in Lakh</p>
      </CardHeader>
      <CardContent className="px-2 pb-4 flex-1 flex flex-col">
        <ResponsiveContainer width="99%" height={200}>
          <LineChart data={activeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              width={45}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} Lakh`,
                name,
              ]}
              labelFormatter={(label) => label}
            />
            <Line
              type="monotone"
              dataKey="recurrent"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              name={t('dashboard.recurrent')}
            />
            <Line
              type="monotone"
              dataKey="capital"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
              name={t('dashboard.capital')}
            />
            <Line
              type="monotone"
              dataKey="financing"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              name={t('dashboard.financing')}
            />
            <Legend
              formatter={(value) => value}
              wrapperStyle={{ paddingTop: '10px', marginBottom: '-5px' }}
              iconType="circle"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

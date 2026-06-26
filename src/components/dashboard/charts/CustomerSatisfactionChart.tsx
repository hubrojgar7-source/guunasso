import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

type FilterType = 'week' | 'month' | 'year';

const weekData = [
  { label: 'Mon', grants: 20, otherReceipts: 10 },
  { label: 'Tue', grants: 25, otherReceipts: 15 },
  { label: 'Wed', grants: 22, otherReceipts: 12 },
  { label: 'Thu', grants: 30, otherReceipts: 14 },
  { label: 'Fri', grants: 28, otherReceipts: 13 },
  { label: 'Sat', grants: 35, otherReceipts: 16 },
  { label: 'Today', grants: 40, otherReceipts: 18 },
];

const monthData = [
  { label: 'Week 1', grants: 120, otherReceipts: 60 },
  { label: 'Week 2', grants: 140, otherReceipts: 70 },
  { label: 'Week 3', grants: 110, otherReceipts: 50 },
  { label: 'Week 4', grants: 150, otherReceipts: 80 },
];

const yearData = [
  { label: 'Jan', grants: 450, otherReceipts: 120 },
  { label: 'Feb', grants: 520, otherReceipts: 150 },
  { label: 'Mar', grants: 480, otherReceipts: 110 },
  { label: 'Apr', grants: 610, otherReceipts: 140 },
  { label: 'May', grants: 590, otherReceipts: 130 },
  { label: 'Jun', grants: 650, otherReceipts: 160 },
  { label: 'Jul', grants: 720, otherReceipts: 180 },
  { label: 'Aug', grants: 700, otherReceipts: 170 },
  { label: 'Sep', grants: 680, otherReceipts: 150 },
  { label: 'Oct', grants: 750, otherReceipts: 190 },
  { label: 'Nov', grants: 730, otherReceipts: 180 },
  { label: 'Dec', grants: 800, otherReceipts: 200 },
];

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'week',  label: 'This Week'  },
  { key: 'month', label: 'This Month' },
  { key: 'year',  label: 'This Year'  },
];

const dataMap: Record<FilterType, typeof weekData> = {
  week: weekData,
  month: monthData,
  year: yearData,
};

export const CustomerSatisfactionChart = () => {
  const [filter, setFilter] = useState<FilterType>('year');
  const activeData = dataMap[filter];

  return (
    <Card className="bg-white border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg font-semibold text-zinc-900">Revenue</CardTitle>
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
        <ResponsiveContainer width="99%" height={260}>
          <AreaChart 
            data={activeData}
            margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
          >
            <defs>
              <linearGradient id="colorGrants" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorOtherReceipts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false}
              className="text-sm text-gray-600"
              tick={{ fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              className="text-sm text-gray-600"
              tick={{ fontSize: 11 }}
              width={35}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => [`${value} Lakh`, name]}
              labelFormatter={(label) => label}
            />
            <Area
              type="monotone"
              dataKey="grants"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGrants)"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Grants"
            />
            <Area
              type="monotone"
              dataKey="otherReceipts"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOtherReceipts)"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Other Receipts"
            />
            <Legend 
              wrapperStyle={{ paddingTop: '15px' }}
              iconType="circle"
              verticalAlign="bottom"
              height={40}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

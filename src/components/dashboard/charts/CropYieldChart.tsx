import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/formatters';

const weatherData = [
  { day: 'months.feb', temperature: 25, humidity: 60 },
  { day: 'months.mar', temperature: 27, humidity: 65 },
  { day: 'months.apr', temperature: 23, humidity: 70 },
  { day: 'months.may', temperature: 26, humidity: 55 },
  { day: 'months.jun', temperature: 28, humidity: 50 },
  { day: 'months.jul', temperature: 24, humidity: 68 },
  { day: 'months.aug', temperature: 22, humidity: 75 },
  { day: 'months.sep', temperature: 26, humidity: 65 },
  { day: 'months.oct', temperature: 24, humidity: 60 },
  { day: 'months.nov', temperature: 22, humidity: 70 },
  { day: 'months.dec', temperature: 20, humidity: 75 },
  { day: 'months.jan', temperature: 18, humidity: 80 },
];

export const CropYieldChart = () => {
  const { t } = useTranslation();

  // Translate month names
  const translatedData = weatherData.map(item => ({
    ...item,
    translatedDay: t(item.day)
  }));

  const [filter, setFilter] = React.useState<'week' | 'month' | 'year'>('year');

  const filterOptions: { key: 'week' | 'month' | 'year'; label: string }[] = [
    { key: 'week',  label: 'This Week'  },
    { key: 'month', label: 'This Month' },
    { key: 'year',  label: 'This Year'  },
  ];

  return (
    <Card className="bg-white border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-zinc-900">{t('chart.cropYield')}</CardTitle>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'week' | 'month' | 'year')}
              className="mt-2 text-sm border border-gray-100 rounded-md px-3 py-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="sm" className="border-gray-100 bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            {t('dashboard.exportPDF')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4 flex-1 flex flex-col">
        <div className="w-full flex-1">
          <ResponsiveContainer width="99%" height={320}>
            <LineChart 
              data={translatedData}
              margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="translatedDay" 
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
                tick={{ fontSize: 12 }}
                width={30}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelFormatter={(label) => label}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#6366f1' }}
                name={t('dashboard.temperature')}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center">
          <div className="text-sm text-gray-600">{t('months.jun')} 2021</div>
          <div className="ml-2 text-lg font-semibold text-zinc-900">{formatCurrency(45591)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

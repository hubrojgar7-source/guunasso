
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Landmark, Receipt, CreditCard } from 'lucide-react';
import { VisitorInsightsChart } from './charts/VisitorInsightsChart';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

type FilterType = 'week' | 'month' | 'year';

const getStartDate = (filter: FilterType): Date => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (filter === 'week') {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    now.setDate(now.getDate() - diff);
  } else if (filter === 'month') {
    now.setDate(1);
  } else {
    now.setMonth(0, 1);
  }
  return now;
};

export const SalesSummarySection = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>('week');
  const [complaintsCount, setComplaintsCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [activePetitions, setActivePetitions] = useState(0);
  const [totalSignatures, setTotalSignatures] = useState(0);

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: 'week',  label: t('dashboard.thisWeek') },
    { key: 'month', label: t('dashboard.thisMonth') },
    { key: 'year',  label: t('dashboard.thisYear') },
  ];

  const fetchData = useCallback(async () => {
    try {
      const startDate = getStartDate(filter);
      const complaintsQ = query(
        collection(db, 'complaints'),
        where('createdAt', '>=', Timestamp.fromDate(startDate))
      );
      const complaintsSnap = await getDocs(complaintsQ);
      setComplaintsCount(complaintsSnap.size);

      const resolvedQ = query(
        collection(db, 'complaints'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('status', '==', 'resolved')
      );
      const resolvedSnap = await getDocs(resolvedQ);
      setResolvedCount(resolvedSnap.size);

      const activeQ = query(
        collection(db, 'petitions'),
        where('status', '==', 'active')
      );
      const activeSnap = await getDocs(activeQ);
      setActivePetitions(activeSnap.size);

      const allPetitionsSnap = await getDocs(collection(db, 'petitions'));
      let totalSig = 0;
      allPetitionsSnap.forEach(doc => {
        totalSig += doc.data().totalSignatures || 0;
      });
      setTotalSignatures(totalSig);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const salesData = [
    {
      titleKey: 'dashboard.complaintsToday',
      value: complaintsCount,
      isCurrency: false,
      change: 0,
      icon: Wallet,
      bgColor: "bg-pink-100",
      iconColor: "text-white",
      circleBg: "bg-pink-400"
    },
    {
      titleKey: 'dashboard.resolvedToday',
      value: resolvedCount,
      isCurrency: false,
      change: 0,
      icon: Landmark,
      bgColor: "bg-orange-100",
      iconColor: "text-white",
      circleBg: "bg-orange-300"
    },
    {
      titleKey: 'dashboard.activePetitions',
      value: activePetitions,
      isCurrency: false,
      change: 0,
      icon: Receipt,
      bgColor: "bg-green-100",
      iconColor: "text-white",
      circleBg: "bg-green-400"
    },
    {
      titleKey: 'dashboard.totalSignatures',
      value: totalSignatures,
      isCurrency: false,
      change: 0,
      icon: CreditCard,
      bgColor: "bg-purple-100",
      iconColor: "text-white",
      circleBg: "bg-purple-400"
    }
  ];

  const filterLabel = filterOptions.find(o => o.key === filter)?.label || '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <Card className="bg-white border border-gray-200/50 rounded-lg overflow-hidden shadow-sm h-full w-full relative">
        <CardHeader className="pb-0 px-3 pt-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-lg font-bold text-zinc-900">{t('dashboard.todayOverview')}</CardTitle>
              <p className="text-xs text-gray-600 mt-0.5">{filterLabel}</p>
            </div>
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
        </CardHeader>
        <CardContent className="pt-4 px-3 pb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {salesData.map((item, index) => {
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
                  <div className="text-xs text-gray-600 mb-0.5">{t(item.titleKey)}</div>
                  <div className="text-xs text-blue-600">+{item.change}% {t('dashboard.fromYesterday')}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <VisitorInsightsChart />
    </div>
  );
};

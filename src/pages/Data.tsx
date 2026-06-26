import React, { useState, useEffect } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { Loader2, Save, BarChart3, PieChart, LineChart, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  getUserChartData, 
  saveUserChartData, 
  getDefaultRevenueData,
  getDefaultComplaintCategoryData,
  getDefaultPetitionGrowthData,
  getDefaultCustomerSatisfactionData,
  getDefaultTargetVsRealityData,
  getDefaultTrafficSourceData,
  getDefaultPopularRouteData,
  RevenueData,
  ComplaintCategoryData,
  PetitionGrowthData,
  CustomerSatisfactionData,
  TargetVsRealityData,
  TrafficSourceData,
  PopularRouteData
} from '@/lib/chartData';

const Data = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('revenue');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Chart data states
  const [revenueData, setRevenueData] = useState<RevenueData[]>(getDefaultRevenueData());
  const [complaintCategoryData, setComplaintCategoryData] = useState<ComplaintCategoryData[]>(getDefaultComplaintCategoryData());
  const [petitionGrowthData, setPetitionGrowthData] = useState<PetitionGrowthData[]>(getDefaultPetitionGrowthData());
  const [customerSatisfactionData, setCustomerSatisfactionData] = useState<CustomerSatisfactionData[]>(getDefaultCustomerSatisfactionData());
  const [targetVsRealityData, setTargetVsRealityData] = useState<TargetVsRealityData[]>(getDefaultTargetVsRealityData());
  const [trafficSourceData, setTrafficSourceData] = useState<TrafficSourceData[]>(getDefaultTrafficSourceData());
  const [popularRouteData, setPopularRouteData] = useState<PopularRouteData[]>(getDefaultPopularRouteData());
  
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const userData = await getUserChartData();
        if (userData) {
          if (userData.revenueData) setRevenueData(userData.revenueData);
          if (userData.complaintCategoryData) setComplaintCategoryData(userData.complaintCategoryData);
          if (userData.petitionGrowthData) setPetitionGrowthData(userData.petitionGrowthData);
          if (userData.customerSatisfactionData) setCustomerSatisfactionData(userData.customerSatisfactionData);
          if (userData.targetVsRealityData) setTargetVsRealityData(userData.targetVsRealityData);
          if (userData.trafficSourceData) setTrafficSourceData(userData.trafficSourceData);
          if (userData.popularRouteData) setPopularRouteData(userData.popularRouteData);
        }
      } catch (error) {
        console.error("Error loading user chart data:", error);
        toast.error(t('data.loadError'));
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [t]);
  
  const handleSave = async () => {
    setSaving(true);
    try {
      // Save the data for the active tab
      switch (activeTab) {
        case 'revenue':
          await saveUserChartData('revenueData', revenueData);
          break;
        case 'complaintCategories':
          await saveUserChartData('complaintCategoryData', complaintCategoryData);
          break;
        case 'petitionGrowth':
          await saveUserChartData('petitionGrowthData', petitionGrowthData);
          break;
        case 'customerSatisfaction':
          await saveUserChartData('customerSatisfactionData', customerSatisfactionData);
          break;
        case 'targetVsReality':
          await saveUserChartData('targetVsRealityData', targetVsRealityData);
          break;
        case 'trafficSources':
          await saveUserChartData('trafficSourceData', trafficSourceData);
          break;
        case 'popularRoutes':
          await saveUserChartData('popularRouteData', popularRouteData);
          break;
        default:
          break;
      }
      
      window.dispatchEvent(new CustomEvent('chart-data-updated', { detail: { tab: activeTab } }));
      toast.success(t('data.saveSuccess'));
    } catch (error) {
      console.error("Error saving chart data:", error);
      toast.error(t('data.saveError'));
    } finally {
      setSaving(false);
    }
  };
  
  // Update revenue data
  const updateRevenueData = (index: number, field: 'onlineSales' | 'offlineSales', value: string) => {
    const newData = [...revenueData];
    newData[index][field] = Number(value);
    setRevenueData(newData);
  };
  
  // Update complaint category data
  const updateComplaintCategoryData = (index: number, value: string) => {
    const newData = [...complaintCategoryData];
    newData[index].value = Number(value);
    setComplaintCategoryData(newData);
  };
  
  // Update petition growth data
  const updatePetitionGrowthData = (index: number, value: string) => {
    const newData = [...petitionGrowthData];
    newData[index].count = Number(value);
    setPetitionGrowthData(newData);
  };
  
  // Update customer satisfaction data
  const updateCustomerSatisfactionData = (index: number, field: 'lastMonth' | 'thisMonth', value: string) => {
    const newData = [...customerSatisfactionData];
    newData[index][field] = Number(value);
    setCustomerSatisfactionData(newData);
  };
  
  // Update target vs reality data
  const updateTargetVsRealityData = (index: number, field: 'reality' | 'target', value: string) => {
    const newData = [...targetVsRealityData];
    newData[index][field] = Number(value);
    setTargetVsRealityData(newData);
  };
  
  // Update traffic source data
  const updateTrafficSourceData = (index: number, value: string) => {
    const newData = [...trafficSourceData];
    newData[index].value = Number(value);
    setTrafficSourceData(newData);
  };
  
  // Update popular route data
  const updatePopularRouteName = (index: number, value: string) => {
    const newData = [...popularRouteData];
    newData[index].name = value;
    setPopularRouteData(newData);
  };
  
  const updatePopularRouteBookings = (index: number, value: string) => {
    const newData = [...popularRouteData];
    newData[index].bookings = Number(value);
    setPopularRouteData(newData);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-8">
          <TabsList>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('data.revenue')}
            </TabsTrigger>
            <TabsTrigger value="complaintCategories" className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              {t('data.complaintCategories')}
            </TabsTrigger>
            <TabsTrigger value="petitionGrowth" className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              {t('data.petitionGrowth')}
            </TabsTrigger>
            <TabsTrigger value="customerSatisfaction" className="flex items-center gap-2">
              <ArrowUp className="h-5 w-5" />
              {t('data.customerSatisfaction')}
            </TabsTrigger>
            <TabsTrigger value="targetVsReality" className="flex items-center gap-2">
              <ArrowDown className="h-5 w-5" />
              {t('data.targetVsReality')}
            </TabsTrigger>
            <TabsTrigger value="trafficSources" className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              {t('data.trafficSources')}
            </TabsTrigger>
            <TabsTrigger value="popularRoutes" className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('data.popularRoutes')}
            </TabsTrigger>
          </TabsList>
          
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 h-11 px-6 text-base">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {t('common.save')}
          </Button>
        </div>
          
          {/* Revenue Data Form */}
          <TabsContent value="revenue">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">{t('data.editRevenueData')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {revenueData.map((item, index) => (
                  <div key={index} className="border rounded-xl p-6 bg-card">
                    <h4 className="font-semibold text-base mb-4">{t(`days.${item.day.toLowerCase()}`)}</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`online-${index}`} className="text-base">{t('chart.onlineSales')}</Label>
                        <Input 
                          id={`online-${index}`}
                          type="number" 
                          value={item.onlineSales} 
                          onChange={(e) => updateRevenueData(index, 'onlineSales', e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`offline-${index}`} className="text-base">{t('chart.offlineSales')}</Label>
                        <Input 
                          id={`offline-${index}`}
                          type="number" 
                          value={item.offlineSales} 
                          onChange={(e) => updateRevenueData(index, 'offlineSales', e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Complaint Category Data Form */}
          <TabsContent value="complaintCategories">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">{t('data.editComplaintCategories')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {complaintCategoryData.map((item, index) => (
                  <div key={index} className="border rounded-xl p-6 bg-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-5 h-5 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <h4 className="font-semibold text-base">{t(item.nameKey)}</h4>
                    </div>
                    <div>
                      <Label htmlFor={`complaint-value-${index}`} className="text-base">{t('data.value')}</Label>
                      <Input 
                        id={`complaint-value-${index}`}
                        type="number" 
                        value={item.value} 
                        onChange={(e) => updateComplaintCategoryData(index, e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Petition Growth Data Form */}
          <TabsContent value="petitionGrowth">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">{t('data.editPetitionGrowth')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {petitionGrowthData.map((item, index) => (
                  <div key={index} className="border rounded-xl p-6 bg-card">
                    <h4 className="font-semibold text-base mb-4">{t(item.month)}</h4>
                    <div>
                      <Label htmlFor={`petition-count-${index}`} className="text-base">{t('data.count')}</Label>
                      <Input 
                        id={`petition-count-${index}`}
                        type="number" 
                        value={item.count} 
                        onChange={(e) => updatePetitionGrowthData(index, e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Customer Satisfaction Data Form */}
          <TabsContent value="customerSatisfaction">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">{t('data.editCustomerSatisfaction')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {customerSatisfactionData.map((item, index) => (
                  <div key={index} className="border rounded-xl p-6 bg-card">
                    <h4 className="font-semibold text-base mb-4">{t(item.month)}</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`last-month-${index}`} className="text-base">{t('chart.lastMonth')}</Label>
                        <Input 
                          id={`last-month-${index}`}
                          type="number" 
                          value={item.lastMonth} 
                          onChange={(e) => updateCustomerSatisfactionData(index, 'lastMonth', e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`this-month-${index}`} className="text-base">{t('chart.thisMonth')}</Label>
                        <Input 
                          id={`this-month-${index}`}
                          type="number" 
                          value={item.thisMonth} 
                          onChange={(e) => updateCustomerSatisfactionData(index, 'thisMonth', e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Target vs Reality Data Form */}
          <TabsContent value="targetVsReality">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">{t('data.editTargetVsReality')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {targetVsRealityData.map((item, index) => (
                  <div key={index} className="border rounded-xl p-6 bg-card">
                    <h4 className="font-semibold text-base mb-4">{t(item.month)}</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`reality-${index}`} className="text-base">{t('chart.reality')}</Label>
                        <Input 
                          id={`reality-${index}`}
                          type="number" 
                          value={item.reality} 
                          onChange={(e) => updateTargetVsRealityData(index, 'reality', e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`target-${index}`} className="text-base">{t('chart.target')}</Label>
                        <Input 
                          id={`target-${index}`}
                          type="number" 
                          value={item.target} 
                          onChange={(e) => updateTargetVsRealityData(index, 'target', e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Traffic Sources Data Form */}
          <TabsContent value="trafficSources">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">{t('data.editTrafficSources')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trafficSourceData.map((item, index) => (
                  <div key={index} className="border rounded-xl p-6 bg-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-5 h-5 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <h4 className="font-semibold text-base">{t(item.source)}</h4>
                    </div>
                    <div>
                      <Label htmlFor={`traffic-value-${index}`} className="text-base">{t('data.value')}</Label>
                      <Input 
                        id={`traffic-value-${index}`}
                        type="number" 
                        value={item.value} 
                        onChange={(e) => updateTrafficSourceData(index, e.target.value)}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Popular Routes Data Form */}
          <TabsContent value="popularRoutes">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">{t('data.editPopularRoutes')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {popularRouteData.map((item, index) => (
                  <div key={index} className="border rounded-xl p-6 bg-card">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`route-name-${index}`} className="text-base">{t('data.routeName')}</Label>
                        <Input 
                          id={`route-name-${index}`}
                          value={item.name} 
                          onChange={(e) => updatePopularRouteName(index, e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`route-bookings-${index}`} className="text-base">{t('data.bookings')}</Label>
                        <Input 
                          id={`route-bookings-${index}`}
                          type="number" 
                          value={item.bookings} 
                          onChange={(e) => updatePopularRouteBookings(index, e.target.value)}
                          className="h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default Data; 
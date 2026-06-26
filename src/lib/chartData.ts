import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  Timestamp,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { db, auth } from './firebase';

// Enable offline data persistence
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('Firestore persistence has been enabled.');
    })
    .catch((err) => {
      console.error('Error enabling Firestore persistence:', err);
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence.');
      }
    });
} catch (error) {
  console.error('Error with Firestore persistence setup:', error);
}

// Types for chart data
export interface RevenueData {
  day: string;
  taxRevenue: number;
  nonTaxRevenue: number;
}

export interface ComplaintCategoryData {
  nameKey: string;
  value: number;
  color: string;
}

export interface PetitionGrowthData {
  month: string;
  count: number;
}

export interface CustomerSatisfactionData {
  month: string;
  lastMonth: number;
  thisMonth: number;
}

export interface TargetVsRealityData {
  month: string;
  reality: number;
  target: number;
}

export interface TrafficSourceData {
  source: string;
  value: number;
  color: string;
}

export interface PopularRouteData {
  name: string;
  bookings: number;
}

// Interface for all chart data
export interface UserChartData {
  userId: string;
  revenueData?: RevenueData[];
  complaintCategoryData?: ComplaintCategoryData[];
  petitionGrowthData?: PetitionGrowthData[];
  customerSatisfactionData?: CustomerSatisfactionData[];
  targetVsRealityData?: TargetVsRealityData[];
  trafficSourceData?: TrafficSourceData[];
  popularRouteData?: PopularRouteData[];
  lastUpdated?: Timestamp | Date;
}

// Save chart data for current user
export const saveUserChartData = async (chartType: string, data: any): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const chartRef = doc(db, 'chartData', user.uid);
    const chartDoc = await getDoc(chartRef);

    const updateData = {
      [chartType]: data,
      lastUpdated: serverTimestamp()
    };

    if (chartDoc.exists()) {
      // Update existing document
      await updateDoc(chartRef, updateData);
    } else {
      // Create new document
      await setDoc(chartRef, {
        userId: user.uid,
        ...updateData
      });
    }
  } catch (error) {
    console.error(`Error saving ${chartType} data:`, error);

    // Store data in localStorage as fallback when offline
    try {
      const fallbackKey = `chart_data_${user.uid}_${chartType}`;
      localStorage.setItem(fallbackKey, JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
        pending: true
      }));
      console.log(`Saved ${chartType} data to local storage (offline mode)`);
    } catch (localError) {
      console.error('Failed to save to localStorage:', localError);
    }

    throw error;
  }
};

// Get all chart data for current user
export const getUserChartData = async (): Promise<UserChartData | null> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const chartRef = doc(db, 'chartData', user.uid);
    const chartDoc = await getDoc(chartRef);

    if (chartDoc.exists()) {
      const data = chartDoc.data() as UserChartData;
      return {
        ...data,
        lastUpdated: data.lastUpdated instanceof Timestamp
          ? data.lastUpdated.toDate()
          : data.lastUpdated
      };
    } else {
      // Check localStorage for any pending offline data
      const offlineData = checkOfflineData(user.uid);
      if (offlineData) {
        return offlineData;
      }
      return null;
    }
  } catch (error) {
    console.error("Error getting chart data:", error);

    // Try to retrieve from localStorage if offline
    const offlineData = checkOfflineData(user.uid);
    if (offlineData) {
      console.log("Retrieved chart data from local storage (offline mode)");
      return offlineData;
    }

    throw error;
  }
};

// Get specific chart data for current user
export const getSpecificChartData = async <T>(chartType: string): Promise<T[] | null> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const chartRef = doc(db, 'chartData', user.uid);
    const chartDoc = await getDoc(chartRef);

    if (chartDoc.exists()) {
      const data = chartDoc.data();
      return data[chartType] as T[] || null;
    } else {
      // Check localStorage for specific chart type
      try {
        const fallbackKey = `chart_data_${user.uid}_${chartType}`;
        const storedData = localStorage.getItem(fallbackKey);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log(`Retrieved ${chartType} data from local storage (offline mode)`);
          return parsedData.data;
        }
      } catch (localError) {
        console.error('Failed to retrieve from localStorage:', localError);
      }
      return null;
    }
  } catch (error) {
    console.error(`Error getting ${chartType} data:`, error);

    // Try to retrieve from localStorage if offline
    try {
      const fallbackKey = `chart_data_${user.uid}_${chartType}`;
      const storedData = localStorage.getItem(fallbackKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log(`Retrieved ${chartType} data from local storage (offline mode)`);
        return parsedData.data;
      }
    } catch (localError) {
      console.error('Failed to retrieve from localStorage:', localError);
    }

    throw error;
  }
};

// Helper function to check offline storage for chart data
const checkOfflineData = (userId: string): UserChartData | null => {
  try {
    const chartTypes = [
      'revenueData',
      'complaintCategoryData',
      'petitionGrowthData',
      'customerSatisfactionData',
      'targetVsRealityData',
      'trafficSourceData',
      'popularRouteData'
    ];

    let hasOfflineData = false;
    const userData: UserChartData = {
      userId
    };

    chartTypes.forEach(type => {
      const fallbackKey = `chart_data_${userId}_${type}`;
      const storedData = localStorage.getItem(fallbackKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        userData[type] = parsedData.data;
        hasOfflineData = true;
      }
    });

    return hasOfflineData ? userData : null;
  } catch (error) {
    console.error('Error reading offline data:', error);
    return null;
  }
};

// Default data templates
export const getDefaultRevenueData = (): RevenueData[] => [
  { day: 'Monday',    taxRevenue: 42, nonTaxRevenue: 18 },
  { day: 'Tuesday',   taxRevenue: 38, nonTaxRevenue: 15 },
  { day: 'Wednesday', taxRevenue: 50, nonTaxRevenue: 22 },
  { day: 'Thursday',  taxRevenue: 45, nonTaxRevenue: 19 },
  { day: 'Friday',    taxRevenue: 53, nonTaxRevenue: 24 },
  { day: 'Saturday',  taxRevenue: 30, nonTaxRevenue: 12 },
  { day: 'Sunday',    taxRevenue: 35, nonTaxRevenue: 14 }
];

export const getDefaultComplaintCategoryData = (): ComplaintCategoryData[] => [
  { nameKey: 'complaintCategories.infrastructure', value: 35, color: '#8884d8' },
  { nameKey: 'complaintCategories.health', value: 25, color: '#82ca9d' },
  { nameKey: 'complaintCategories.education', value: 20, color: '#ffc658' },
  { nameKey: 'complaintCategories.governance', value: 15, color: '#ff7300' },
  { nameKey: 'complaintCategories.other', value: 5, color: '#8dd1e1' }
];

export const getDefaultPetitionGrowthData = (): PetitionGrowthData[] => [
  { month: 'months.jan', count: 0 },
  { month: 'months.feb', count: 0 },
  { month: 'months.mar', count: 0 },
  { month: 'months.apr', count: 0 },
  { month: 'months.may', count: 0 },
  { month: 'months.jun', count: 0 }
];

export const getDefaultCustomerSatisfactionData = (): CustomerSatisfactionData[] => [
  { month: 'months.jan', lastMonth: 0, thisMonth: 0 },
  { month: 'months.feb', lastMonth: 0, thisMonth: 0 },
  { month: 'months.mar', lastMonth: 0, thisMonth: 0 },
  { month: 'months.apr', lastMonth: 0, thisMonth: 0 },
  { month: 'months.may', lastMonth: 0, thisMonth: 0 },
  { month: 'months.jun', lastMonth: 0, thisMonth: 0 },
  { month: 'months.jul', lastMonth: 0, thisMonth: 0 }
];

export const getDefaultTargetVsRealityData = (): TargetVsRealityData[] => [
  { month: 'months.jan', reality: 0, target: 0 },
  { month: 'months.feb', reality: 0, target: 0 },
  { month: 'months.mar', reality: 0, target: 0 },
  { month: 'months.apr', reality: 0, target: 0 },
  { month: 'months.may', reality: 0, target: 0 },
  { month: 'months.jun', reality: 0, target: 0 },
  { month: 'months.jul', reality: 0, target: 0 }
];

export const getDefaultTrafficSourceData = (): TrafficSourceData[] => [
  { source: 'trafficSource.direct', value: 0, color: '#8884d8' },
  { source: 'trafficSource.social', value: 0, color: '#82ca9d' },
  { source: 'trafficSource.email', value: 0, color: '#ffc658' },
  { source: 'trafficSource.ads', value: 0, color: '#ff7300' },
  { source: 'trafficSource.referral', value: 0, color: '#8dd1e1' }
];

export const getDefaultPopularRouteData = (): PopularRouteData[] => [
  { name: 'Kathmandu-Pokhara', bookings: 0 },
  { name: 'Kathmandu-Bharatpur', bookings: 0 },
  { name: 'Pokhara-Butwal', bookings: 0 },
  { name: 'Kathmandu-Biratnagar', bookings: 0 },
  { name: 'Kathmandu-Nepalgunj', bookings: 0 }
]; 
import { useState, useEffect, useCallback } from 'react';
import { api, DashboardData, PeriodStats, InsightsResponse } from '@/services/api';

// Generic hook for API calls
function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Hook for dashboard data
export function useDashboard() {
  return useApiCall<DashboardData>(() => api.getDashboard());
}

// Hook for period statistics
export function usePeriodStats(period: 'today' | 'week' | 'month') {
  return useApiCall<PeriodStats>(() => api.getPeriodStats(period), [period]);
}

// Hook for insights
export function useInsights() {
  return useApiCall<InsightsResponse>(() => api.getInsights());
}

// Hook for data refresh
export function useDataRefresh() {
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      await api.refreshData();
      // Return true to indicate success
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setRefreshing(false);
    }
  }, []);

  return { refresh, refreshing, error };
}
import { useState, useEffect, useCallback } from 'react';
import { 
  DashboardData, 
  PeriodStats, 
  InsightsResponse,
  DailyReportData,
  ProfitReportData,
  AnalysisData,
  ABCAnalysisData
} from '@/services/api';
import { webappApi } from '@/services/webapp-api';

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
      console.error('API call failed:', err);
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
  return useApiCall<DashboardData>(() => webappApi.getDashboard());
}

// Hook for period statistics
export function usePeriodStats(period: 'today' | 'week' | 'month') {
  return useApiCall<PeriodStats>(() => webappApi.getPeriodStats(period), [period]);
}

// Hook for insights
export function useInsights() {
  return useApiCall<InsightsResponse>(() => webappApi.getInsights());
}

// Hook for data refresh
export function useDataRefresh() {
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      await webappApi.refreshData();
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

// Hook for daily report
export function useDailyReport(date?: string) {
  return useApiCall<DailyReportData>(() => webappApi.getDailyReport(date), [date]);
}

// Hook for profit report
export function useProfitReport(date?: string) {
  return useApiCall<ProfitReportData>(() => webappApi.getProfitReport(date), [date]);
}

// Hook for analysis
export function useAnalysis(month?: string) {
  return useApiCall<AnalysisData>(() => webappApi.getAnalysis(month), [month]);
}

// Hook for ABC analysis
export function useABCAnalysis(days: number = 30) {
  return useApiCall<ABCAnalysisData>(() => webappApi.getABCAnalysis(days), [days]);
}
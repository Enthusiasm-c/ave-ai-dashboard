import { TelegramWebApp } from '@/types/telegram';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

// Use proxy in production
const getApiUrl = (path: string, params?: URLSearchParams) => {
  if (window.location.hostname.includes('vercel.app')) {
    // Use Vercel proxy
    const fullPath = `${API_VERSION}${path}`;
    let url = `/api/proxy?path=${encodeURIComponent(fullPath)}`;
    if (params) {
      url += `&${params.toString()}`;
    }
    return url;
  }
  let url = `${API_BASE_URL}${API_VERSION}${path}`;
  if (params) {
    url += `?${params.toString()}`;
  }
  return url;
};

// Types
export interface DashboardData {
  revenue_today: number;
  revenue_yesterday: number;
  orders_today: number;
  orders_yesterday: number;
  avg_check_today: number;
  avg_check_yesterday: number;
  table_turnover: number;
  revenue_trend: number;
  orders_trend: number;
  avg_check_trend: number;
  daily_target: number;
  daily_progress: number;
}

export interface PeriodStats {
  period: string;
  revenue: number;
  orders: number;
  avg_check: number;
  top_dishes: Array<{
    name: string;
    revenue: number;
  }>;
  hourly_distribution: Array<{
    hour: number;
    revenue: number;
    orders: number;
  }>;
}

export interface Insight {
  type: string;
  title: string;
  content: string;
  severity: string;
  created_at: string;
}

export interface InsightsResponse {
  insights: Insight[];
  message?: string;
}

// New types for bot endpoints
export interface DailyReportData {
  date: string;
  revenue: number;
  orders: number;
  avg_check: number;
  items_sold: number;
  top_dishes: Array<{
    name: string;
    revenue: number;
    rank: number;
  }>;
  hourly_data: Array<{
    hour: number;
    revenue: number;
    orders: number;
  }>;
  kpis?: {
    [key: string]: any;
  };
}

export interface ProfitReportData {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  margin_percent: number;
  items: Array<{
    name: string;
    quantity: number;
    revenue: number;
    cost: number;
    profit: number;
    margin_percent: number;
  }>;
  summary: {
    total_items: number;
    profitable_items: number;
    loss_items: number;
  };
}

export interface AnalysisData {
  period: string;
  total_revenue: number;
  total_orders: number;
  avg_daily_revenue: number;
  avg_check: number;
  best_day: {
    date: string;
    revenue: number;
  };
  worst_day: {
    date: string;
    revenue: number;
  };
  weekly_pattern: Array<{
    day: string;
    avg_revenue: number;
  }>;
  top_categories: Array<{
    name: string;
    revenue: number;
  }>;
  top_dishes: Array<{
    name: string;
    revenue: number;
  }>;
  payment_methods: {
    [key: string]: number;
  };
}

export interface ABCAnalysisData {
  period: string;
  summary: {
    totalItems: number;
    efficientItems: number;
    optimizationNeeded: number;
    recommendRemove: number;
  };
  items: Array<{
    name: string;
    class: string;
    revenue: number;
    quantity: number;
    category: string;
    status: string;
    revenue_percent: number;
  }>;
  categories: {
    top: Array<{
      name: string;
      revenue: number;
      items: number;
    }>;
    problem: Array<{
      name: string;
      revenue: number;
      items: number;
    }>;
  };
}

// Helper to get auth params from Telegram WebApp
function getTelegramAuthParams(): URLSearchParams {
  const WebApp = (window as any).Telegram?.WebApp as TelegramWebApp;
  
  if (!WebApp?.initDataUnsafe?.user) {
    // For development/testing
    return new URLSearchParams({
      user_id: '123456789',
      auth_date: Math.floor(Date.now() / 1000).toString(),
      hash: 'development',
      first_name: 'Test',
      username: 'testuser'
    });
  }

  const user = WebApp.initDataUnsafe.user;
  const authDate = WebApp.initDataUnsafe.auth_date || Math.floor(Date.now() / 1000);
  
  // In production, hash should be provided by Telegram
  const params = new URLSearchParams({
    user_id: user.id.toString(),
    auth_date: authDate.toString(),
    hash: WebApp.initDataUnsafe.hash || 'missing',
  });

  if (user.first_name) params.append('first_name', user.first_name);
  if (user.last_name) params.append('last_name', user.last_name);
  if (user.username) params.append('username', user.username);

  return params;
}

// API client
export const api = {
  // Get dashboard data
  async getDashboard(): Promise<DashboardData> {
    const authParams = getTelegramAuthParams();
    const url = getApiUrl('/dashboard', authParams);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard: ${response.statusText}`);
    }

    return response.json();
  },

  // Get statistics for a period
  async getPeriodStats(period: 'today' | 'week' | 'month'): Promise<PeriodStats> {
    const authParams = getTelegramAuthParams();
    const url = getApiUrl(`/stats/${period}`, authParams);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }

    return response.json();
  },

  // Get AI insights
  async getInsights(): Promise<InsightsResponse> {
    const authParams = getTelegramAuthParams();
    const url = getApiUrl('/insights', authParams);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch insights: ${response.statusText}`);
    }

    return response.json();
  },

  // Trigger data refresh
  async refreshData(): Promise<{ status: string; message: string }> {
    const authParams = getTelegramAuthParams();
    const url = getApiUrl('/refresh-data', authParams);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh data: ${response.statusText}`);
    }

    return response.json();
  },

  // Bot endpoints
  async getDailyReport(date?: string): Promise<DailyReportData> {
    const authParams = getTelegramAuthParams();
    if (date) {
      authParams.append('date_str', date);
    }
    
    const url = getApiUrl('/bot/daily', authParams);
    console.log('Fetching daily report from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch daily report: ${response.statusText}`);
    }

    return response.json();
  },

  async getProfitReport(date?: string): Promise<ProfitReportData> {
    const authParams = getTelegramAuthParams();
    if (date) {
      authParams.append('date_str', date);
    }
    const url = getApiUrl('/bot/profit', authParams);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profit report: ${response.statusText}`);
    }

    return response.json();
  },

  async getAnalysis(month?: string): Promise<AnalysisData> {
    const authParams = getTelegramAuthParams();
    if (month) {
      authParams.append('month', month);
    }
    const url = getApiUrl('/bot/analysis', authParams);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch analysis: ${response.statusText}`);
    }

    return response.json();
  },

  async getABCAnalysis(days: number = 30): Promise<ABCAnalysisData> {
    const authParams = getTelegramAuthParams();
    authParams.append('days', days.toString());
    const url = getApiUrl('/bot/abc', authParams);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ABC analysis: ${response.statusText}`);
    }

    return response.json();
  },
};

// Format currency
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(1)}K`;
  }
  return `Rp ${amount.toFixed(0)}`;
}

// Format percentage
export function formatPercentage(value: number, showSign = true): string {
  const sign = value > 0 && showSign ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

// Format trend
export function getTrendDirection(value: number): 'up' | 'down' | 'neutral' {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'neutral';
}
import { TelegramWebApp } from '@/types/telegram';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

// Types (same as in api.ts)
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

// Cache for auth token
let authCache: { token: string; expires: number } | null = null;

// Get auth token using initData
async function getAuthToken(): Promise<string> {
  // Check cache first
  if (authCache && authCache.expires > Date.now()) {
    return authCache.token;
  }

  const WebApp = (window as any).Telegram?.WebApp as TelegramWebApp;
  
  if (!WebApp?.initData) {
    throw new Error('Telegram WebApp not available');
  }

  // Verify initData with backend
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/webapp/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      init_data: WebApp.initData
    })
  });

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  // For now, use user_id as token (in production, backend should return JWT)
  const token = data.user_id.toString();
  
  // Cache for 23 hours (less than 24h validity)
  authCache = {
    token,
    expires: Date.now() + (23 * 60 * 60 * 1000)
  };

  return token;
}

// Make authenticated API request
async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${API_VERSION}${path}`, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    // Clear cache on auth error
    if (error instanceof Error && error.message.includes('Authentication')) {
      authCache = null;
    }
    throw error;
  }
}

// API client with new auth approach
export const webappApi = {
  // Get dashboard data
  async getDashboard(): Promise<DashboardData> {
    return apiRequest<DashboardData>('/dashboard');
  },

  // Get daily report
  async getDailyReport(date?: string): Promise<any> {
    const params = date ? `?date_str=${date}` : '';
    return apiRequest<any>(`/bot/daily${params}`);
  },

  // Get profit report
  async getProfitReport(date?: string): Promise<any> {
    const params = date ? `?date_str=${date}` : '';
    return apiRequest<any>(`/bot/profit${params}`);
  },

  // Get analysis
  async getAnalysis(month?: string): Promise<any> {
    const params = month ? `?month=${month}` : '';
    return apiRequest<any>(`/bot/analysis${params}`);
  },

  // Get ABC analysis
  async getABCAnalysis(days: number = 30): Promise<any> {
    return apiRequest<any>(`/bot/abc?days=${days}`);
  },

  // Get period stats
  async getPeriodStats(period: 'today' | 'week' | 'month'): Promise<any> {
    return apiRequest<any>(`/stats/${period}`);
  },

  // Get insights
  async getInsights(): Promise<any> {
    return apiRequest<any>('/insights');
  },

  // Refresh data
  async refreshData(): Promise<any> {
    return apiRequest<any>('/refresh-data', {
      method: 'POST'
    });
  },

  // Test new auth endpoint
  async testAuth(): Promise<any> {
    const WebApp = (window as any).Telegram?.WebApp as TelegramWebApp;
    
    if (!WebApp?.initData) {
      throw new Error('Telegram WebApp not available');
    }

    const response = await fetch(`${API_BASE_URL}${API_VERSION}/webapp/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        init_data: WebApp.initData
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Auth failed: ${response.status} - ${error}`);
    }

    return response.json();
  }
};
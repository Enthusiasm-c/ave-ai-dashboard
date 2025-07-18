import { useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { useDashboard, usePeriodStats, useInsights, useDataRefresh } from '@/hooks/useApi';
import { KPICard } from '@/components/Dashboard/KPICard';
import { formatCurrency, formatPercentage, getTrendDirection } from '@/services/api';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { showAlert, hapticFeedback } = useTelegram();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Fetch data
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboard();
  const { data: periodData, loading: periodLoading } = usePeriodStats(selectedPeriod);
  const { data: insightsData, loading: insightsLoading } = useInsights();
  const { refresh, refreshing } = useDataRefresh();

  // Handle refresh
  const handleRefresh = async () => {
    hapticFeedback();
    const success = await refresh();
    if (success) {
      showAlert('Data refreshed successfully! 🔄');
      // Reload the page to fetch new data
      window.location.reload();
    } else {
      showAlert('Failed to refresh data. Please try again.');
    }
  };

  const handleCardClick = (metric: string) => {
    hapticFeedback();
    showAlert(`Detailed ${metric} analytics coming soon!`);
  };

  const handlePeriodChange = (period: 'today' | 'week' | 'month') => {
    hapticFeedback();
    setSelectedPeriod(period);
  };

  const handleActionClick = (action: string) => {
    hapticFeedback();
    showAlert(`${action} feature coming soon!`);
  };

  // Loading state
  if (dashboardLoading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardError) {
    return (
      <div className="dashboard">
        <div className="error-state">
          <h2>⚠️ Unable to load data</h2>
          <p>{dashboardError.message}</p>
          <button className="primary-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="dashboard">
        <div className="error-state">
          <h2>📊 No data available</h2>
          <p>Connect your POS system to start seeing analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-inner">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>📊 Daily Report</h1>
            <p>Sales data and insights</p>
          </div>
          <div className="date-picker-container">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => {
                hapticFeedback();
                setSelectedDate(e.target.value);
              }}
              max={new Date().toISOString().split('T')[0]}
              className="date-picker"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        {/* Refresh Button */}
        <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
          <button 
            className="secondary-button"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            {refreshing ? 'Refreshing...' : '🔄 Refresh Data'}
          </button>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stats-period">
            <h2>Key Metrics</h2>
            <div className="period-selector">
              <button 
                className={`period-button ${selectedPeriod === 'today' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('today')}
              >
                Today
              </button>
              <button 
                className={`period-button ${selectedPeriod === 'week' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('week')}
              >
                Week
              </button>
              <button 
                className={`period-button ${selectedPeriod === 'month' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('month')}
              >
                Month
              </button>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="kpi-grid">
            <KPICard
              title="Revenue"
              value={formatCurrency(dashboardData.revenue_today)}
              subtitle={`Target: ${formatCurrency(dashboardData.daily_target)}`}
              icon="💰"
              visualization="circular"
              progress={dashboardData.daily_progress}
              color={dashboardData.revenue_trend >= 0 ? "success" : "warning"}
              trend={{ 
                direction: getTrendDirection(dashboardData.revenue_trend), 
                value: formatPercentage(dashboardData.revenue_trend) 
              }}
              onClick={() => handleCardClick('Revenue')}
            />
            
            <KPICard
              title="Orders"
              value={dashboardData.orders_today.toString()}
              subtitle={`vs ${dashboardData.orders_yesterday} yesterday`}
              icon="🛒"
              color="info"
              trend={{ 
                direction: getTrendDirection(dashboardData.orders_trend), 
                value: formatPercentage(dashboardData.orders_trend) 
              }}
              onClick={() => handleCardClick('Orders')}
            />
            
            <KPICard
              title="Avg Check"
              value={formatCurrency(dashboardData.avg_check_today)}
              subtitle={`vs ${formatCurrency(dashboardData.avg_check_yesterday)} yesterday`}
              icon="💳"
              visualization="number"
              color={dashboardData.avg_check_trend >= 0 ? "success" : "warning"}
              trend={{ 
                direction: getTrendDirection(dashboardData.avg_check_trend), 
                value: formatPercentage(dashboardData.avg_check_trend) 
              }}
              onClick={() => handleCardClick('Average Check')}
            />
            
            <KPICard
              title="Table Turnover"
              value={`${dashboardData.table_turnover}x`}
              subtitle="Per day"
              icon="⏱️"
              color="success"
              trend={{ direction: 'up', value: '+0.4' }}
              onClick={() => handleCardClick('Table Turnover')}
            />
          </div>
        </div>

        {/* Period Stats */}
        {periodData && !periodLoading && (
          <div className="period-stats" style={{ marginBottom: '2rem' }}>
            <h2>Top Dishes - {selectedPeriod}</h2>
            <div className="top-dishes-list">
              {periodData.top_dishes.slice(0, 5).map((dish, index) => (
                <div key={index} className="dish-item" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.5rem'
                }}>
                  <span>{index + 1}. {dish.name}</span>
                  <span style={{ color: 'var(--accent-success)' }}>
                    {formatCurrency(dish.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card" onClick={() => handleActionClick('View Menu Performance')}>
              <div className="action-icon">📋</div>
              <div className="action-title">Menu Analysis</div>
            </div>
            <div className="action-card" onClick={() => handleActionClick('Staff Schedule')}>
              <div className="action-icon">👥</div>
              <div className="action-title">Staff</div>
            </div>
            <div className="action-card" onClick={() => handleActionClick('Inventory')}>
              <div className="action-icon">📦</div>
              <div className="action-title">Inventory</div>
            </div>
            <div className="action-card" onClick={() => handleActionClick('Reports')}>
              <div className="action-icon">📈</div>
              <div className="action-title">Reports</div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="insights-section">
          <div className="insights-header">
            <h2>🤖 AI Insights</h2>
          </div>
          <div className="insights-list">
            {insightsLoading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading insights...</p>
            ) : insightsData?.insights && insightsData.insights.length > 0 ? (
              insightsData.insights.map((insight, index) => (
                <div key={index} className="insight-item">
                  <span className="insight-icon">
                    {insight.type === 'revenue' ? '📈' : 
                     insight.type === 'menu' ? '🍔' : '⚡'}
                  </span>
                  <div className="insight-content">
                    <h3 className="insight-title">{insight.title}</h3>
                    <p className="insight-description">{insight.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="insight-item">
                <span className="insight-icon">💡</span>
                <div className="insight-content">
                  <h3 className="insight-title">No insights yet</h3>
                  <p className="insight-description">
                    AI insights will appear here after analyzing your restaurant data.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
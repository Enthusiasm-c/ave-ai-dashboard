import { useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { KPICard } from '@/components/Dashboard/KPICard';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { showAlert, hapticFeedback } = useTelegram();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const handleCardClick = (metric: string) => {
    hapticFeedback();
    showAlert(`Detailed ${metric} analytics will be available soon!`);
  };

  const handlePeriodChange = (period: string) => {
    hapticFeedback();
    setSelectedPeriod(period);
  };

  const handleActionClick = (action: string) => {
    hapticFeedback();
    showAlert(`${action} feature coming soon!`);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-inner">
        {/* Header */}
        <div className="dashboard-header">
          <h1>📊 Dashboard</h1>
          <p>Real-time insights for your restaurant</p>
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
              value="Rp 1.5M"
              subtitle="Daily Target: 2M"
              icon="💰"
              visualization="circular"
              progress={75}
              color="success"
              trend={{ direction: 'up', value: '+12.5%' }}
              onClick={() => handleCardClick('Revenue')}
            />
            
            <KPICard
              title="Orders"
              value="89"
              subtitle="vs 82 yesterday"
              icon="🛒"
              color="info"
              trend={{ direction: 'up', value: '+8.5%' }}
              onClick={() => handleCardClick('Orders')}
            />
            
            <KPICard
              title="Avg Check"
              value="Rp 16.8K"
              subtitle="Target: 18K"
              icon="💳"
              visualization="circular"
              progress={93}
              color="warning"
              trend={{ direction: 'down', value: '-3.2%' }}
              onClick={() => handleCardClick('Average Check')}
            />
            
            <KPICard
              title="Table Turnover"
              value="3.2x"
              subtitle="Per day"
              icon="⏱️"
              color="success"
              trend={{ direction: 'up', value: '+0.4' }}
              onClick={() => handleCardClick('Table Turnover')}
            />
          </div>
        </div>

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
            <div className="insight-item">
              <span className="insight-icon">📈</span>
              <div className="insight-content">
                <h3 className="insight-title">Revenue Opportunity</h3>
                <p className="insight-description">
                  Your lunch service is 23% below capacity. Consider promotional offers between 12-2 PM.
                </p>
              </div>
            </div>
            
            <div className="insight-item">
              <span className="insight-icon">🍔</span>
              <div className="insight-content">
                <h3 className="insight-title">Menu Optimization</h3>
                <p className="insight-description">
                  "Nasi Goreng Special" has 40% higher profit margin but 60% lower orders than regular version.
                </p>
              </div>
            </div>
            
            <div className="insight-item">
              <span className="insight-icon">⚡</span>
              <div className="insight-content">
                <h3 className="insight-title">Efficiency Alert</h3>
                <p className="insight-description">
                  Kitchen prep time increased by 15% this week. Review staffing for peak hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
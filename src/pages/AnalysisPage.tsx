import { useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { useAnalysis } from '@/hooks/useApi';
import { formatCurrency } from '@/services/api';
import './AnalysisPage.css';

export const AnalysisPage = () => {
  const { hapticFeedback, showAlert } = useTelegram();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  
  const { data: analysisData, loading, error } = useAnalysis(selectedMonth);
  
  if (error) {
    showAlert(`Error: ${error}`);
  }

  return (
    <div className="analysis-page">
      <div className="analysis-header">
        <div>
          <h1>📈 30-Day Analysis</h1>
          <p>Monthly trends & insights</p>
        </div>
        <div className="month-picker-container">
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => {
              hapticFeedback();
              setSelectedMonth(e.target.value);
            }}
            max={currentMonth}
            className="month-picker"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading analysis...</p>
        </div>
      ) : analysisData ? (
        <>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>💰 Revenue Overview</h3>
              <div className="metric-item">
                <span className="metric-label">Total Revenue:</span>
                <span className="metric-value">{formatCurrency(analysisData.total_revenue)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Daily Average:</span>
                <span className="metric-value">{formatCurrency(analysisData.avg_daily_revenue)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Best Day:</span>
                <span className="metric-value">{formatCurrency(analysisData.best_day.revenue)}</span>
              </div>
            </div>

            <div className="metric-card">
              <h3>🛒 Orders & Check</h3>
              <div className="metric-item">
                <span className="metric-label">Total Orders:</span>
                <span className="metric-value">{analysisData.total_orders}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Average Check:</span>
                <span className="metric-value">{formatCurrency(analysisData.avg_check)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Orders/Day:</span>
                <span className="metric-value">{Math.round(analysisData.total_orders / 30)}</span>
              </div>
            </div>

            <div className="metric-card">
              <h3>📊 Top Categories</h3>
              {analysisData.top_categories.slice(0, 3).map((cat, index) => (
                <div key={index} className="metric-item">
                  <span className="metric-label">{cat.name}:</span>
                  <span className="metric-value">{formatCurrency(cat.revenue)}</span>
                </div>
              ))}
            </div>

            <div className="metric-card">
              <h3>💳 Payment Methods</h3>
              {Object.entries(analysisData.payment_methods).map(([method, amount]) => {
                const percentage = ((amount / analysisData.total_revenue) * 100).toFixed(1);
                return (
                  <div key={method} className="payment-bar">
                    <div 
                      className={`payment-fill ${method.toLowerCase()}`} 
                      style={{ width: `${percentage}%` }}
                    >
                      {method} {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="anomalies-section">
            <h2>📊 Weekly Pattern</h2>
            <div className="weekly-pattern">
              {analysisData.weekly_pattern.map((day, index) => (
                <div key={index} className="day-pattern">
                  <div className="day-name">{day.day}</div>
                  <div className="day-revenue">{formatCurrency(day.avg_revenue)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="anomalies-section">
            <h2>🏆 Top Dishes</h2>
            <div className="top-dishes-grid">
              {analysisData.top_dishes.slice(0, 5).map((dish, index) => (
                <div key={index} className="top-dish-item">
                  <span className="dish-rank">#{index + 1}</span>
                  <span className="dish-name">{dish.name}</span>
                  <span className="dish-revenue">{formatCurrency(dish.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="no-data">
          <p>No data available for selected month</p>
        </div>
      )}
    </div>
  );
};
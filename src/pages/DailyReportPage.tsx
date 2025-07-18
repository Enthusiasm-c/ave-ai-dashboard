import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';
import { useDailyReport } from '@/hooks/useApi';
import { formatCurrency } from '@/services/api';
import './DashboardPage.css';

export const DailyReportPage = () => {
  const navigate = useNavigate();
  const { hapticFeedback, showAlert } = useTelegram();
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  });
  
  // Convert date to DD.MM.YYYY format for API
  const apiDateFormat = selectedDate ? (() => {
    const [year, month, day] = selectedDate.split('-');
    return `${day}.${month}.${year}`;
  })() : undefined;
  
  const { data: dailyData, loading, error } = useDailyReport(apiDateFormat);

  const handleBack = () => {
    hapticFeedback();
    navigate('/');
  };

  if (error) {
    showAlert(`Error: ${error}`);
  }
  
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="header-top">
          <button 
            className="back-button" 
            onClick={handleBack}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1>Daily Report</h1>
        </div>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => {
            hapticFeedback();
            setSelectedDate(e.target.value);
          }}
          max={new Date().toISOString().split('T')[0]}
          className="date-picker"
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading report...</p>
        </div>
      ) : dailyData ? (
        <>
          <div className="metrics-overview">
            <div className="metric-card">
              <div className="metric-value">{formatCurrency(dailyData.revenue)}</div>
              <div className="metric-label">Total Revenue</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{dailyData.orders}</div>
              <div className="metric-label">Orders</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{formatCurrency(dailyData.avg_check)}</div>
              <div className="metric-label">Avg Check</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{dailyData.items_sold}</div>
              <div className="metric-label">Items Sold</div>
            </div>
          </div>

          <div className="report-sections">
            <div className="report-section">
              <h2>Top Dishes</h2>
              <div className="top-dishes-list">
                {dailyData.top_dishes.map((dish, index) => (
                  <div key={index} className="dish-item">
                    <div className="dish-rank">#{dish.rank}</div>
                    <div className="dish-info">
                      <div className="dish-name">{dish.name}</div>
                      <div className="dish-revenue">{formatCurrency(dish.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-section">
              <h2>Hourly Performance</h2>
              <div className="hourly-chart">
                {dailyData.hourly_data.length > 0 && dailyData.hourly_data.map((hour, index) => {
                  const maxRevenue = Math.max(...dailyData.hourly_data.map(h => h.revenue));
                  const heightPercent = maxRevenue > 0 ? (hour.revenue / maxRevenue) * 100 : 0;
                  
                  return (
                    <div key={index} className="hour-bar">
                      <div className="bar-container">
                        <div 
                          className="bar-fill"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <div className="hour-label">{hour.hour}:00</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-data">
          <p>No data available for selected date</p>
        </div>
      )}
    </div>
  );
};
import { useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { useProfitReport } from '@/hooks/useApi';
import { formatCurrency } from '@/services/api';
import './ProfitPage.css';

export const ProfitPage = () => {
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
  
  const { data: profitData, loading, error } = useProfitReport(apiDateFormat);
  
  if (error) {
    showAlert(`Error: ${error}`);
  }

  return (
    <div className="profit-page">
      <div className="profit-header">
        <div>
          <h1>💰 Profit Report</h1>
          <p>Revenue & margins analysis</p>
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
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profit report...</p>
        </div>
      ) : profitData ? (
        <>
          <div className="profit-summary">
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <div className="summary-label">Total Revenue</div>
                <div className="summary-value">{formatCurrency(profitData.revenue)}</div>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">💸</div>
              <div className="summary-content">
                <div className="summary-label">Total Costs</div>
                <div className="summary-value">{formatCurrency(profitData.cost)}</div>
              </div>
            </div>
            
            <div className="summary-card highlight">
              <div className="summary-icon">💵</div>
              <div className="summary-content">
                <div className="summary-label">Total Profit</div>
                <div className="summary-value">{formatCurrency(profitData.profit)}</div>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">📈</div>
              <div className="summary-content">
                <div className="summary-label">Margin</div>
                <div className="summary-value">{profitData.margin_percent.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="top-dishes-section">
            <h2>🏆 Top Dishes by Profit</h2>
            <div className="dishes-list">
              {profitData.items.slice(0, 10).map((dish, index) => (
                <div key={index} className="dish-card">
                  <div className="dish-rank">{index + 1}</div>
                  <div className="dish-details">
                    <div className="dish-name">{dish.name}</div>
                    <div className="dish-stats">
                      <span>Qty: {dish.quantity}</span>
                      <span>•</span>
                      <span>Margin: {dish.margin_percent.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="dish-profit">{formatCurrency(dish.profit)}</div>
                </div>
              ))}
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
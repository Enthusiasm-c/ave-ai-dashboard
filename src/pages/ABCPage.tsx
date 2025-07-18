import { useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { useABCAnalysis } from '@/hooks/useApi';
import { formatCurrency } from '@/services/api';
import './ABCPage.css';

export const ABCPage = () => {
  const { hapticFeedback, showAlert } = useTelegram();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  
  const { data: abcData, loading, error } = useABCAnalysis(parseInt(selectedPeriod));
  
  if (error) {
    showAlert(`Error: ${error}`);
  }

  const handleDownload = () => {
    hapticFeedback();
    showAlert('Downloading ABC analysis report...');
    // In real app, this would trigger download
  };

  const getClassColor = (className: string) => {
    switch(className) {
      case 'A': return '#4CAF50';
      case 'B': return '#2196F3';
      case 'C': return '#FF9800';
      default: return '#757575';
    }
  };

  return (
    <div className="abc-page">
      <div className="abc-header">
        <div>
          <h1>🎯 ABC Analysis</h1>
          <p>Menu performance ranking</p>
        </div>
        <div className="header-controls">
          <select 
            value={selectedPeriod} 
            onChange={(e) => {
              hapticFeedback();
              setSelectedPeriod(e.target.value);
            }}
            className="period-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button onClick={handleDownload} className="download-button">
            📥 Download Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading ABC analysis...</p>
        </div>
      ) : abcData ? (
        <>
          <div className="abc-summary">
            <div className="summary-stat">
              <div className="stat-value">{abcData.summary.totalItems}</div>
              <div className="stat-label">Total Menu Items</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">{abcData.summary.efficientItems}</div>
              <div className="stat-label">Efficient Items (A+B)</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">{abcData.summary.optimizationNeeded}</div>
              <div className="stat-label">Need Optimization (C)</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">{abcData.summary.recommendRemove}</div>
              <div className="stat-label">Recommend Remove</div>
            </div>
          </div>

          <div className="abc-content">
            <div className="items-section">
              <h2>Menu Items by Class</h2>
              <div className="items-list">
                {abcData.items.map((item, index) => (
                  <div key={index} className="item-card">
                    <div 
                      className="item-class" 
                      style={{ backgroundColor: getClassColor(item.class) }}
                    >
                      {item.class}
                    </div>
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                      <div className="item-status">{item.status}</div>
                    </div>
                    <div className="item-metrics">
                      <div className="item-revenue">{formatCurrency(item.revenue)}</div>
                      <div className="item-quantity">{item.quantity} sold</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="categories-section">
              <div className="category-group">
                <h3>🏆 Top Categories by Revenue</h3>
                {abcData.categories.top.map((cat, index) => (
                  <div key={index} className="category-item">
                    <div className="category-info">
                      <div className="category-name">{cat.name}</div>
                      <div className="category-items">{cat.items} items</div>
                    </div>
                    <div className="category-revenue">{formatCurrency(cat.revenue)}</div>
                  </div>
                ))}
              </div>

              {abcData.categories.problem.length > 0 && (
                <div className="category-group">
                  <h3>⚠️ Problem Categories</h3>
                  {abcData.categories.problem.map((cat, index) => (
                    <div key={index} className="category-item problem">
                      <div className="category-info">
                        <div className="category-name">{cat.name}</div>
                        <div className="category-items">{cat.items} items</div>
                      </div>
                      <div className="category-revenue">{formatCurrency(cat.revenue)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="no-data">
          <p>No data available for selected period</p>
        </div>
      )}
    </div>
  );
};
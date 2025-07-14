import { useTelegram } from '@/hooks/useTelegram';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { showAlert, hapticFeedback } = useTelegram();

  const handleTestAlert = () => {
    hapticFeedback();
    showAlert('Dashboard functionality will be added in the next tasks! 📊');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Welcome to Ave AI Control Panel</p>
      </div>

      <div className="dashboard-content">
        <div className="kpi-preview">
          <h2>KPI Metrics</h2>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon">💰</div>
              <div className="kpi-info">
                <h3>Revenue</h3>
                <div className="kpi-value">Rp 1,500,000</div>
                <div className="kpi-trend">📈 +12.5%</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🛒</div>
              <div className="kpi-info">
                <h3>Orders</h3>
                <div className="kpi-value">89</div>
                <div className="kpi-trend">📈 +8.2%</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">💳</div>
              <div className="kpi-info">
                <h3>Average Check</h3>
                <div className="kpi-value">Rp 16,854</div>
                <div className="kpi-trend">📈 +3.8%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <h3>🚧 Under Development</h3>
          <p>Full dashboard functionality will be added in the next tasks:</p>
          <ul>
            <li>📊 Interactive charts</li>
            <li>📈 Menu ABC analysis</li>
            <li>🤖 AI recommendations</li>
            <li>📋 Detailed reports</li>
          </ul>
          
          <button onClick={handleTestAlert} className="primary-button">
            Test Features
          </button>
        </div>
      </div>
    </div>
  );
};
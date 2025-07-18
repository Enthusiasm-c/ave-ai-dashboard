import { useNavigate } from 'react-router-dom';
import { useTelegram } from '@/hooks/useTelegram';
import './OnboardingPage.css';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, hapticFeedback } = useTelegram();

  const handleDailyReport = () => {
    hapticFeedback();
    navigate('/dashboard');
  };

  const handleProfitReport = () => {
    hapticFeedback();
    navigate('/profit');
  };

  const handleAnalysis = () => {
    hapticFeedback();
    navigate('/analysis');
  };

  const handleABCReport = () => {
    hapticFeedback();
    navigate('/abc');
  };

  const handleSettings = () => {
    hapticFeedback();
    navigate('/settings');
  };

  const handleDebug = () => {
    hapticFeedback();
    navigate('/debug');
  };

  return (
    <div className="onboarding">
      <div className="onboarding-content">
        <div className="welcome-section">
          <div className="welcome-icon">🏪</div>
          <h1 className="welcome-title">
            Welcome to Ave AI!
          </h1>
          <p className="welcome-subtitle">
            Smart analytics for your restaurant
          </p>
        </div>

        {user && (
          <div className="user-welcome">
            <p>Hello, <strong>{user.first_name}</strong>!</p>
            <p>Ready to start restaurant analytics?</p>
          </div>
        )}

        <div className="main-actions">
          <h3>Reports & Analytics</h3>
          <div className="actions-grid">
            <button 
              onClick={handleDailyReport}
              className="action-button"
            >
              <span className="action-icon">📊</span>
              <span className="action-title">Daily Report</span>
              <span className="action-subtitle">Sales data for any day</span>
            </button>
            
            <button 
              onClick={handleProfitReport}
              className="action-button"
            >
              <span className="action-icon">💰</span>
              <span className="action-title">Profit Report</span>
              <span className="action-subtitle">Revenue & margins analysis</span>
            </button>
            
            <button 
              onClick={handleAnalysis}
              className="action-button"
            >
              <span className="action-icon">📈</span>
              <span className="action-title">30-Day Analysis</span>
              <span className="action-subtitle">Monthly trends & insights</span>
            </button>
            
            <button 
              onClick={handleABCReport}
              className="action-button"
            >
              <span className="action-icon">🎯</span>
              <span className="action-title">ABC Analysis</span>
              <span className="action-subtitle">Menu performance ranking</span>
            </button>
          </div>
          
          <div className="settings-section">
            <button 
              onClick={handleSettings}
              className="settings-button"
            >
              <span className="action-icon">⚙️</span>
              <span className="action-title">Settings</span>
            </button>
            <button 
              onClick={handleDebug}
              className="settings-button"
              style={{ marginLeft: '10px' }}
            >
              <span className="action-icon">🐛</span>
              <span className="action-title">Debug</span>
            </button>
          </div>
        </div>

        <div className="features-preview">
          <h3>What awaits you:</h3>
          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Daily analytics</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🤖</span>
              <span>AI recommendations</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📈</span>
              <span>Menu ABC analysis</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💰</span>
              <span>Profit reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '@/hooks/useTelegram';
import './OnboardingPage.css';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, showAlert, hapticFeedback } = useTelegram();
  const [, setIsConnected] = useState(false);

  const handleGetStarted = () => {
    hapticFeedback();
    showAlert('Welcome to Ave AI! 🎉');
    // Simulate connection check
    setTimeout(() => {
      setIsConnected(true);
      navigate('/dashboard');
    }, 1000);
  };

  const handleConnectPOS = () => {
    hapticFeedback();
    showAlert('POS connection feature will be added in the next tasks');
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

        <div className="onboarding-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Connect POS System</h3>
              <p>Syrve, Poster or other systems</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Configure Settings</h3>
              <p>Seats, working hours, expenses</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Insights</h3>
              <p>AI analysis and growth recommendations</p>
            </div>
          </div>
        </div>

        <div className="onboarding-actions">
          <button 
            onClick={handleConnectPOS}
            className="secondary-button"
          >
            🔗 Connect POS
          </button>
          
          <button 
            onClick={handleGetStarted}
            className="primary-button"
          >
            🚀 Get Started
          </button>
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
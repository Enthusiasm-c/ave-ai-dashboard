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
    showAlert('Добро пожаловать в Ave AI! 🎉');
    // Имитация проверки подключения
    setTimeout(() => {
      setIsConnected(true);
      navigate('/dashboard');
    }, 1000);
  };

  const handleConnectPOS = () => {
    hapticFeedback();
    showAlert('Функция подключения POS будет добавлена в следующих задачах');
  };

  return (
    <div className="onboarding">
      <div className="onboarding-content">
        <div className="welcome-section">
          <div className="welcome-icon">🏪</div>
          <h1 className="welcome-title">
            Добро пожаловать в Ave AI!
          </h1>
          <p className="welcome-subtitle">
            Умная аналитика для вашего ресторана
          </p>
        </div>

        {user && (
          <div className="user-welcome">
            <p>Привет, <strong>{user.first_name}</strong>!</p>
            <p>Готовы начать аналитику ресторана?</p>
          </div>
        )}

        <div className="onboarding-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Подключите POS систему</h3>
              <p>Syrve, Poster или другую систему</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Настройте параметры</h3>
              <p>Количество мест, часы работы, расходы</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Получайте insights</h3>
              <p>AI анализ и рекомендации для роста</p>
            </div>
          </div>
        </div>

        <div className="onboarding-actions">
          <button 
            onClick={handleConnectPOS}
            className="secondary-button"
          >
            🔗 Подключить POS
          </button>
          
          <button 
            onClick={handleGetStarted}
            className="primary-button"
          >
            🚀 Начать работу
          </button>
        </div>

        <div className="features-preview">
          <h3>Что вас ждет:</h3>
          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Ежедневная аналитика</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🤖</span>
              <span>AI рекомендации</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📈</span>
              <span>ABC анализ меню</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💰</span>
              <span>Отчеты по прибыли</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
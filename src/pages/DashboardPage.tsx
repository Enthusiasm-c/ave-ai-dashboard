import { useTelegram } from '@/hooks/useTelegram';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { showAlert, hapticFeedback } = useTelegram();

  const handleTestAlert = () => {
    hapticFeedback();
    showAlert('Dashboard функциональность будет добавлена в следующих задачах! 📊');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Дашборд</h1>
        <p>Добро пожаловать в панель управления Ave AI</p>
      </div>

      <div className="dashboard-content">
        <div className="kpi-preview">
          <h2>KPI Метрики</h2>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon">💰</div>
              <div className="kpi-info">
                <h3>Выручка</h3>
                <div className="kpi-value">Rp 1,500,000</div>
                <div className="kpi-trend">📈 +12.5%</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🛒</div>
              <div className="kpi-info">
                <h3>Заказы</h3>
                <div className="kpi-value">89</div>
                <div className="kpi-trend">📈 +8.2%</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">💳</div>
              <div className="kpi-info">
                <h3>Средний чек</h3>
                <div className="kpi-value">Rp 16,854</div>
                <div className="kpi-trend">📈 +3.8%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <h3>🚧 В разработке</h3>
          <p>Полная функциональность дашборда будет добавлена в следующих задачах:</p>
          <ul>
            <li>📊 Интерактивные графики</li>
            <li>📈 ABC анализ меню</li>
            <li>🤖 AI рекомендации</li>
            <li>📋 Детальные отчеты</li>
          </ul>
          
          <button onClick={handleTestAlert} className="primary-button">
            Тест функций
          </button>
        </div>
      </div>
    </div>
  );
};
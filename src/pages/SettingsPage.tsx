import { useTelegram } from '@/hooks/useTelegram';
import './SettingsPage.css';

export const SettingsPage = () => {
  const { user, showAlert, hapticFeedback } = useTelegram();

  const handleSettingClick = (setting: string) => {
    hapticFeedback();
    showAlert(`Настройка "${setting}" будет добавлена в следующих задачах!`);
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>⚙️ Настройки</h1>
        <p>Конфигурация ресторана и приложения</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>🏪 Ресторан</h2>
          <div className="settings-list">
            <button 
              className="setting-item"
              onClick={() => handleSettingClick('Основная информация')}
            >
              <span className="setting-icon">🏷️</span>
              <div className="setting-info">
                <h3>Основная информация</h3>
                <p>Название, адрес, контакты</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>

            <button 
              className="setting-item"
              onClick={() => handleSettingClick('Часы работы')}
            >
              <span className="setting-icon">🕐</span>
              <div className="setting-info">
                <h3>Часы работы</h3>
                <p>График работы ресторана</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>

            <button 
              className="setting-item"
              onClick={() => handleSettingClick('Количество мест')}
            >
              <span className="setting-icon">🪑</span>
              <div className="setting-info">
                <h3>Количество мест</h3>
                <p>Вместимость ресторана</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>💰 Финансы</h2>
          <div className="settings-list">
            <button 
              className="setting-item"
              onClick={() => handleSettingClick('ФОТ')}
            >
              <span className="setting-icon">👥</span>
              <div className="setting-info">
                <h3>Фонд оплаты труда</h3>
                <p>Месячные расходы на персонал</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>

            <button 
              className="setting-item"
              onClick={() => handleSettingClick('Аренда')}
            >
              <span className="setting-icon">🏢</span>
              <div className="setting-info">
                <h3>Аренда</h3>
                <p>Стоимость аренды помещения</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>

            <button 
              className="setting-item"
              onClick={() => handleSettingClick('Коммунальные услуги')}
            >
              <span className="setting-icon">💡</span>
              <div className="setting-info">
                <h3>Коммунальные услуги</h3>
                <p>Электричество, вода, интернет</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>🔗 Интеграции</h2>
          <div className="settings-list">
            <button 
              className="setting-item"
              onClick={() => handleSettingClick('POS система')}
            >
              <span className="setting-icon">🏪</span>
              <div className="setting-info">
                <h3>POS система</h3>
                <p>Подключение Syrve, Poster</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>
          </div>
        </div>

        {user && (
          <div className="settings-section">
            <h2>👤 Аккаунт</h2>
            <div className="user-info-card">
              <div className="user-avatar">
                {user.first_name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h3>{user.first_name} {user.last_name || ''}</h3>
                {user.username && <p>@{user.username}</p>}
                <p>ID: {user.id}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
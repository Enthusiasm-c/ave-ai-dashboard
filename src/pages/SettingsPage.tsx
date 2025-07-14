import { useTelegram } from '@/hooks/useTelegram';
import './SettingsPage.css';

export const SettingsPage = () => {
  const { user, showAlert, hapticFeedback } = useTelegram();

  const handleSettingClick = (setting: string) => {
    hapticFeedback();
    showAlert(`"${setting}" setting will be added in the next tasks!`);
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Restaurant and application configuration</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>🏪 Restaurant</h2>
          <div className="settings-list">
            <button 
              className="setting-item"
              onClick={() => handleSettingClick('Basic Information')}
            >
              <span className="setting-icon">🏷️</span>
              <div className="setting-info">
                <h3>Basic Information</h3>
                <p>Name, address, contacts</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>

            <button 
              className="setting-item"
              onClick={() => handleSettingClick('Working Hours')}
            >
              <span className="setting-icon">🕐</span>
              <div className="setting-info">
                <h3>Working Hours</h3>
                <p>Restaurant schedule</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>

            <button 
              className="setting-item"
              onClick={() => handleSettingClick('Seating Capacity')}
            >
              <span className="setting-icon">🪑</span>
              <div className="setting-info">
                <h3>Seating Capacity</h3>
                <p>Restaurant capacity</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>💰 Finance</h2>
          <div className="settings-list">
            <button 
              className="setting-item"
              onClick={() => handleSettingClick('Payroll')}
            >
              <span className="setting-icon">👥</span>
              <div className="setting-info">
                <h3>Payroll Fund</h3>
                <p>Monthly staff expenses</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>

            <button 
              className="setting-item"
              onClick={() => handleSettingClick('Rent')}
            >
              <span className="setting-icon">🏢</span>
              <div className="setting-info">
                <h3>Rent</h3>
                <p>Monthly rent cost</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>

            <button 
              className="setting-item"
              onClick={() => handleSettingClick('Utilities')}
            >
              <span className="setting-icon">💡</span>
              <div className="setting-info">
                <h3>Utilities</h3>
                <p>Electricity, water, internet</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>🔗 Integrations</h2>
          <div className="settings-list">
            <button 
              className="setting-item"
              onClick={() => handleSettingClick('POS System')}
            >
              <span className="setting-icon">🏪</span>
              <div className="setting-info">
                <h3>POS System</h3>
                <p>Connect Syrve, Poster</p>
              </div>
              <span className="setting-arrow">›</span>
            </button>
          </div>
        </div>

        {user && (
          <div className="settings-section">
            <h2>👤 Account</h2>
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
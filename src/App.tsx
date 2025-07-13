import { useTelegram } from '@/hooks/useTelegram';
import './App.css';

function App() {
  const { user, isReady, showAlert, hapticFeedback } = useTelegram();

  if (!isReady) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Инициализация...</p>
      </div>
    );
  }

  const handleTestAlert = () => {
    showAlert('Привет из Ave AI! 👋');
    hapticFeedback();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Ave AI Dashboard</h1>
        {user && (
          <div className="user-info">
            <p>Привет, <strong>{user.first_name}</strong>!</p>
            {user.username && <p>@{user.username}</p>}
          </div>
        )}
      </header>
      
      <main className="app-main">
        <div className="welcome-card">
          <h2>Добро пожаловать!</h2>
          <p>Telegram Mini App успешно инициализирован</p>
          
          <div className="test-buttons">
            <button onClick={handleTestAlert} className="primary-button">
              Тест Alert
            </button>
          </div>
          
          <div className="debug-info">
            <h3>Debug информация:</h3>
            <ul>
              <li>User ID: {user?.id || 'Не определен'}</li>
              <li>Platform: {window.Telegram?.WebApp?.platform || 'Unknown'}</li>
              <li>Version: {window.Telegram?.WebApp?.version || 'Unknown'}</li>
              <li>Theme: {window.Telegram?.WebApp?.colorScheme || 'Unknown'}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
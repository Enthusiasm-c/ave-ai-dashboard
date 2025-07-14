import { TelegramUser } from '@/types/telegram';
import './Header.css';

interface HeaderProps {
  user: TelegramUser | null;
}

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <h1 className="header-title">🚀 Ave AI</h1>
          <span className="header-subtitle">Restaurant Analytics</span>
        </div>
        
        {user && (
          <div className="header-user">
            <span className="user-greeting">
              Привет, <strong>{user.first_name}</strong>!
            </span>
            {user.username && (
              <span className="user-handle">@{user.username}</span>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
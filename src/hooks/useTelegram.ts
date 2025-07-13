import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import type { TelegramUser } from '@/types/telegram';

interface UseTelegramReturn {
  user: TelegramUser | null;
  isReady: boolean;
  WebApp: typeof WebApp;
  showAlert: (message: string) => void;
  showConfirm: (message: string) => Promise<boolean>;
  hapticFeedback: () => void;
}

export const useTelegram = (): UseTelegramReturn => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Инициализация Telegram WebApp
    WebApp.ready();
    WebApp.expand();
    
    // Настройка темы
    WebApp.setHeaderColor('#667eea');
    WebApp.setBackgroundColor('#ffffff');
    
    // Получение пользователя
    if (WebApp.initDataUnsafe.user) {
      setUser(WebApp.initDataUnsafe.user as TelegramUser);
    }
    
    setIsReady(true);
  }, []);

  const showAlert = (message: string) => {
    WebApp.showAlert(message);
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      WebApp.showConfirm(message, (confirmed) => {
        resolve(confirmed);
      });
    });
  };

  const hapticFeedback = () => {
    WebApp.HapticFeedback.impactOccurred('medium');
  };

  return {
    user,
    isReady,
    WebApp,
    showAlert,
    showConfirm,
    hapticFeedback
  };
};
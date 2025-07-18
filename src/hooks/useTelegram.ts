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
    try {
      // Use native Telegram WebApp if available
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        console.log('Using native Telegram WebApp');
        tg.ready();
        tg.expand();
        
        // Set theme
        tg.setHeaderColor('#667eea');
        tg.setBackgroundColor('#ffffff');
        
        // Get user
        if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user as TelegramUser);
        }
      } else {
        // Fallback to SDK
        console.log('Using SDK WebApp');
        WebApp.ready();
        WebApp.expand();
        
        // Настройка темы
        WebApp.setHeaderColor('#667eea');
        WebApp.setBackgroundColor('#ffffff');
        
        // Получение пользователя
        if (WebApp.initDataUnsafe.user) {
          setUser(WebApp.initDataUnsafe.user as TelegramUser);
        }
      }
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
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
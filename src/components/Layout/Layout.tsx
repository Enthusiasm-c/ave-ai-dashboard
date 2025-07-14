import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { useTelegram } from '@/hooks/useTelegram';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user } = useTelegram();
  
  // Определяем нужно ли показывать навигацию
  const showNavigation = location.pathname !== '/';
  
  return (
    <div className="layout">
      <Header user={user} />
      
      <main className="layout-main">
        {children}
      </main>
      
      {showNavigation && (
        <Navigation currentPath={location.pathname} />
      )}
    </div>
  );
};
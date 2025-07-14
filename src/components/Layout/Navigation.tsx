import { Link } from 'react-router-dom';
import { Home, BarChart3, Settings } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';
import './Navigation.css';

interface NavigationProps {
  currentPath: string;
}

export const Navigation = ({ currentPath }: NavigationProps) => {
  const { hapticFeedback } = useTelegram();

  const navItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Dashboard',
      isActive: currentPath === '/dashboard'
    },
    {
      path: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
      isActive: currentPath === '/analytics'
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings',
      isActive: currentPath === '/settings'
    }
  ];

  const handleNavClick = () => {
    hapticFeedback();
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${item.isActive ? 'nav-item-active' : ''}`}
              onClick={handleNavClick}
            >
              <IconComponent 
                className="nav-icon" 
                size={20}
              />
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
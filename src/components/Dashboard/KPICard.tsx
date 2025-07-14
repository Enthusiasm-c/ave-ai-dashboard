import { ReactNode } from 'react';
import './KPICard.css';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  visualization?: 'circular' | 'bar' | 'number';
  progress?: number; // 0-100 for circular progress
  color?: 'success' | 'warning' | 'info' | 'danger';
  icon?: ReactNode;
  onClick?: () => void;
}

export const KPICard = ({
  title,
  value,
  subtitle,
  trend,
  visualization = 'number',
  progress = 0,
  color = 'info',
  icon,
  onClick
}: KPICardProps) => {
  const renderVisualization = () => {
    if (visualization === 'circular') {
      const circumference = 2 * Math.PI * 45; // radius = 45
      const strokeDashoffset = circumference - (progress / 100) * circumference;
      
      return (
        <div className="kpi-circular-progress">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="var(--border-card)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={`var(--accent-${color})`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 60 60)"
              className="kpi-progress-ring"
            />
          </svg>
          <div className="kpi-circular-value">
            <span className="kpi-main-value">{value}</span>
            {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
          </div>
        </div>
      );
    }
    
    return (
      <div className="kpi-number">
        <span className="kpi-main-value">{value}</span>
        {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
      </div>
    );
  };

  return (
    <div 
      className={`kpi-card kpi-card-${color} ${onClick ? 'kpi-card-clickable' : ''}`}
      onClick={onClick}
    >
      <div className="kpi-header">
        {icon && <span className="kpi-icon">{icon}</span>}
        <h3 className="kpi-title">{title}</h3>
      </div>
      
      <div className="kpi-content">
        {renderVisualization()}
      </div>
      
      {trend && (
        <div className={`kpi-trend kpi-trend-${trend.direction}`}>
          <span className="kpi-trend-icon">
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}
          </span>
          <span className="kpi-trend-value">{trend.value}</span>
        </div>
      )}
    </div>
  );
};
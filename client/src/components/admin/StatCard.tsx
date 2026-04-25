import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, delay = 0 }) => {
  return (
    <motion.div 
      className="stat-card-v2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
    >
      <div className="stat-card-inner">
        <div className="stat-icon-wrapper">
          {icon}
        </div>
        <div className="stat-info">
          <span className="stat-label">{title}</span>
          <div className="stat-value-group">
            <h2 className="stat-number">{value}</h2>
            {trend && (
              <div className={`stat-trend ${trend.isUp ? 'up' : 'down'}`}>
                {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="stat-card-bg-glow" />
    </motion.div>
  );
};

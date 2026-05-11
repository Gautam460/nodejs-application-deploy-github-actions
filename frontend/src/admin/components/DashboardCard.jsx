import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DashboardCard = ({ icon: Icon, title, value, trend, color, bgColor, subtitle }) => {
  return (
    <div className="dashboard-card animate-fade-in">
      <div className="d-flex justify-content-between align-items-start">
        <div className="card-icon-wrapper" style={{ backgroundColor: bgColor, color: color }}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className={`badge ${trend > 0 ? 'badge-green' : 'badge-blue'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', border: 'none' }}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div className="card-label">{title}</div>
        <div className="card-value">{value}</div>
        {subtitle && (
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {subtitle}
          </div>
        )}
      </div>
      
      {/* Decorative Blur Object */}
      <div style={{ 
        position: 'absolute', 
        bottom: '-10px', 
        right: '-10px', 
        width: '60px', 
        height: '60px', 
        background: color, 
        opacity: 0.05, 
        filter: 'blur(30px)', 
        borderRadius: '50%' 
      }}></div>
    </div>
  );
};

export default DashboardCard;

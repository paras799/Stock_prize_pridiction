import React from 'react';

const MetricCard = ({ label, value, subtext, icon: Icon, trend }) => {
  return (
    <div className="metric-stat-card">
      <div className="metric-stat-top">
        <span className="stat-label">{label}</span>
        {Icon && (
          <div className="stat-icon-wrapper">
            <Icon size={18} className="stat-icon" />
          </div>
        )}
      </div>
      <div className="stat-value-group">
        <span className="stat-value">{value}</span>
        {trend && (
          <span className={`stat-trend ${trend.positive ? 'positive' : 'negative'}`}>
            {trend.text}
          </span>
        )}
      </div>
      {subtext && <span className="stat-subtext">{subtext}</span>}
    </div>
  );
};

export default MetricCard;

import React from 'react';

const MetricCard = ({ label, value, subtext, icon: Icon, color = 'cyan' }) => {
  const colorStyles = {
    cyan: { color: 'var(--neon-cyan)', bg: 'rgba(0, 240, 255, 0.1)', border: 'rgba(0, 240, 255, 0.25)' },
    purple: { color: 'var(--neon-purple)', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.25)' },
    emerald: { color: 'var(--neon-emerald)', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)' },
    amber: { color: 'var(--neon-amber)', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)' },
  };

  const currentTheme = colorStyles[color] || colorStyles.cyan;

  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <span className="metric-card-label">{label}</span>
        {Icon && (
          <div
            className="metric-card-icon"
            style={{ color: currentTheme.color, background: currentTheme.bg, borderColor: currentTheme.border }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="metric-card-value">{value}</div>
      {subtext && <div className="metric-card-subtext">{subtext}</div>}
    </div>
  );
};

export default MetricCard;

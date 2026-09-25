import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Activity, BarChart2, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(10, 15, 28, 0.95)',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.1rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
          Date: {formatDate(label)}
        </div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', margin: '0.2rem 0' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: entry.color }} />
            <span style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
            <span className="mono-font" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatCurrency(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const FinancialChart = ({
  historicalData,
  metadata,
  comparisonData,
  currency = 'USD',
  assetName = 'Financial Asset',
  selectedModelKey,
}) => {
  const [timeRange, setTimeRange] = useState(60); // 30, 60, 100 days

  const records = historicalData?.data || [];
  const chartRecords = records.slice(-timeRange);

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={20} style={{ color: 'var(--neon-cyan)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{assetName} Historical Market & ML Forecast</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Interactive financial time-series chart showing daily Close prices and volume metrics
          </p>
        </div>

        {/* Time Range Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(5, 9, 18, 0.8)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {[30, 60, 100].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setTimeRange(days)}
              style={{
                background: timeRange === days ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                border: timeRange === days ? '1px solid rgba(0, 240, 255, 0.4)' : 'none',
                color: timeRange === days ? 'var(--neon-cyan)' : 'var(--text-muted)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart Container */}
      <div style={{ width: '100%', height: 380 }}>
        {chartRecords.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartRecords} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="var(--text-muted)"
                tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
                tickFormatter={(val) => formatDate(val)}
              />
              <YAxis
                stroke="var(--text-muted)"
                tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
                domain={['auto', 'auto']}
                tickFormatter={(val) => formatNumber(val, 0)}
              />
              <Tooltip content={<CustomTooltip currency={currency} />} />
              <Legend wrapperStyle={{ paddingTop: 15, fontSize: 12, fontFamily: 'var(--font-sans)' }} />

              <Area
                type="monotone"
                dataKey="close"
                name="Daily Close Price"
                stroke="#00f0ff"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorClose)"
              />
              <Area
                type="monotone"
                dataKey="high"
                name="Intraday High"
                stroke="#a855f7"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorHigh)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Loading financial time-series chart...
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialChart;

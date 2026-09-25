import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { fetchHoldoutValidation } from '../services/api';
import { ShieldCheck, Activity, Award } from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

const CustomHoldoutTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    const actual = payload.find((p) => p.dataKey === 'actual')?.value;
    const predicted = payload.find((p) => p.dataKey === 'predicted')?.value;
    const diff = actual !== undefined && predicted !== undefined ? Math.abs(actual - predicted) : null;

    return (
      <div
        style={{
          background: 'rgba(10, 15, 28, 0.95)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.1rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
          Date: {formatDate(label)}
        </div>
        <div style={{ color: '#00f0ff', fontSize: '0.875rem', fontWeight: 600 }}>
          Actual Close: {formatCurrency(actual, currency)}
        </div>
        <div style={{ color: '#a855f7', fontSize: '0.875rem', fontWeight: 600 }}>
          Predicted Close: {formatCurrency(predicted, currency)}
        </div>
        {diff !== null && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
            Error Residual: {formatCurrency(diff, currency)}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const HoldoutValidationChart = ({ assetId, modelKey = 'svr', currency = 'USD' }) => {
  const [valData, setValData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!assetId) return;
    setLoading(true);
    fetchHoldoutValidation(assetId, modelKey)
      .then(setValData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [assetId, modelKey]);

  if (loading) {
    return (
      <div className="glass-card" style={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--neon-purple)', fontFamily: 'var(--font-mono)' }}>Loading Holdout Validation Dataset...</span>
      </div>
    );
  }

  if (error || !valData || !valData.test_points) {
    return null; // Graceful fallback
  }

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--neon-purple)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Out-of-Sample Holdout Test Evaluation</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Chronological 15% holdout validation testing (Actual vs Predicted) for model <code style={{ color: 'var(--neon-purple)' }}>{valData.model_name}</code>
          </p>
        </div>

        {/* Holdout Score Badge */}
        {valData.metrics && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.85rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Holdout R² Score</div>
              <div className="mono-font" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--neon-purple)' }}>
                {formatNumber(valData.metrics.r2_percentage, 2)}%
              </div>
            </div>
            <div style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.85rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MAE Error</div>
              <div className="mono-font" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--neon-cyan)' }}>
                {formatCurrency(valData.metrics.mae, currency)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={valData.test_points} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
            <Tooltip content={<CustomHoldoutTooltip currency={currency} />} />
            <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />

            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Historical Close"
              stroke="#00f0ff"
              strokeWidth={2}
              dot={{ r: 3, fill: '#00f0ff' }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name={`Predicted Close (${valData.model_name})`}
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#a855f7' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HoldoutValidationChart;

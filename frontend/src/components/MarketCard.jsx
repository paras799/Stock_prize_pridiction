import { useState } from 'react';
import { Clock, Database, Sliders, RefreshCw, Layers } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

const MarketCard = ({
  marketData,
  currency,
  isCustomInput,
  onCustomSubmit,
  onReset,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [customOpen, setCustomOpen] = useState(marketData?.open || '');
  const [customHigh, setCustomHigh] = useState(marketData?.high || '');
  const [customLow, setCustomLow] = useState(marketData?.low || '');
  const [customVolume, setCustomVolume] = useState(marketData?.volume || '');

  if (!marketData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customOpen || isNaN(customOpen) || Number(customOpen) <= 0) {
      alert('Please enter a valid positive Open price.');
      return;
    }
    onCustomSubmit(customOpen, customHigh, customLow, customVolume);
    setShowForm(false);
  };

  return (
    <div className="glass-card market-card">
      <div className="card-header">
        <div className="card-title-group">
          <Layers size={20} className="accent-icon" />
          <h3>Current Market Snapshot</h3>
          {isCustomInput && <span className="custom-badge">Custom Input Mode</span>}
        </div>
        <div className="card-header-actions">
          {isCustomInput ? (
            <button className="secondary-btn btn-sm" onClick={onReset}>
              <RefreshCw size={14} /> Reset to Real-time
            </button>
          ) : (
            <button
              className="secondary-btn btn-sm"
              onClick={() => {
                setCustomOpen(marketData.open);
                setCustomHigh(marketData.high);
                setCustomLow(marketData.low);
                setCustomVolume(marketData.volume);
                setShowForm(!showForm);
              }}
            >
              <Sliders size={14} /> {showForm ? 'Close Custom Form' : 'Test Custom Input'}
            </button>
          )}
        </div>
      </div>

      <div className="market-metrics-grid">
        <div className="metric-box highlighted-metric">
          <span className="metric-label">Opening Price (Open)</span>
          <span className="metric-value">{formatCurrency(marketData.open, currency)}</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Daily High</span>
          <span className="metric-value">{formatCurrency(marketData.high, currency)}</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Daily Low</span>
          <span className="metric-value">{formatCurrency(marketData.low, currency)}</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Trading Volume</span>
          <span className="metric-value">{formatNumber(marketData.volume, 0)}</span>
        </div>
      </div>

      <div className="market-footer-info">
        <div className="info-chip">
          <Clock size={14} />
          <span>Timestamp: {marketData.timestamp}</span>
        </div>
        <div className="info-chip">
          <Database size={14} />
          <span>Data Source: {marketData.source}</span>
          {marketData.is_delayed && <span className="delayed-tag">Delayed Data</span>}
        </div>
      </div>

      {showForm && (
        <form className="custom-input-form" onSubmit={handleSubmit}>
          <h4 className="form-title">Enter Custom Market Features for What-If Analysis</h4>
          <div className="form-grid">
            <div className="input-group">
              <label>Open Price ({currency}) *</label>
              <input
                type="number"
                step="any"
                required
                value={customOpen}
                onChange={(e) => setCustomOpen(e.target.value)}
                placeholder="e.g. 1250.50"
              />
            </div>
            <div className="input-group">
              <label>High Price ({currency})</label>
              <input
                type="number"
                step="any"
                value={customHigh}
                onChange={(e) => setCustomHigh(e.target.value)}
                placeholder="Optional High"
              />
            </div>
            <div className="input-group">
              <label>Low Price ({currency})</label>
              <input
                type="number"
                step="any"
                value={customLow}
                onChange={(e) => setCustomLow(e.target.value)}
                placeholder="Optional Low"
              />
            </div>
            <div className="input-group">
              <label>Volume</label>
              <input
                type="number"
                step="any"
                value={customVolume}
                onChange={(e) => setCustomVolume(e.target.value)}
                placeholder="Optional Volume"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-btn">
              Predict Close Price Across All Models
            </button>
            <button
              type="button"
              className="text-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MarketCard;

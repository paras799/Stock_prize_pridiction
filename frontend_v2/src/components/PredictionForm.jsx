import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, Zap, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

const PredictionForm = ({
  model,
  marketData,
  currency = 'USD',
  isCustomInput = false,
  onSubmitCustom,
  onResetRealtime,
  loading = false,
}) => {
  const [open, setOpen] = useState('');
  const [high, setHigh] = useState('');
  const [low, setLow] = useState('');
  const [volume, setVolume] = useState('');

  // Sync inputs whenever real-time market data changes
  useEffect(() => {
    if (marketData && !isCustomInput) {
      setOpen(marketData.Open !== undefined ? marketData.Open.toString() : '');
      setHigh(marketData.High !== undefined ? marketData.High.toString() : '');
      setLow(marketData.Low !== undefined ? marketData.Low.toString() : '');
      setVolume(marketData.Volume !== undefined ? marketData.Volume.toString() : '0');
    }
  }, [marketData, isCustomInput]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!open) return;
    onSubmitCustom(open, high, low, volume);
  };

  // Preset Scenario Handlers
  const handlePresetBullish = () => {
    const baseOpen = parseFloat(open) || (marketData?.Open || 100);
    const newOpen = (baseOpen * 1.05).toFixed(2);
    const newHigh = (baseOpen * 1.07).toFixed(2);
    const newLow = (baseOpen * 1.01).toFixed(2);
    const newVol = (parseFloat(volume) * 1.25 || 500000).toFixed(0);

    setOpen(newOpen);
    setHigh(newHigh);
    setLow(newLow);
    setVolume(newVol);
    onSubmitCustom(newOpen, newHigh, newLow, newVol);
  };

  const handlePresetBearish = () => {
    const baseOpen = parseFloat(open) || (marketData?.Open || 100);
    const newOpen = (baseOpen * 0.95).toFixed(2);
    const newHigh = (baseOpen * 0.97).toFixed(2);
    const newLow = (baseOpen * 0.91).toFixed(2);
    const newVol = (parseFloat(volume) * 1.3 || 500000).toFixed(0);

    setOpen(newOpen);
    setHigh(newHigh);
    setLow(newLow);
    setVolume(newVol);
    onSubmitCustom(newOpen, newHigh, newLow, newVol);
  };

  const handlePresetHighVol = () => {
    const baseOpen = parseFloat(open) || (marketData?.Open || 100);
    const newHigh = (baseOpen * 1.10).toFixed(2);
    const newLow = (baseOpen * 0.90).toFixed(2);
    const newVol = (parseFloat(volume) * 2.0 || 1000000).toFixed(0);

    setHigh(newHigh);
    setLow(newLow);
    setVolume(newVol);
    onSubmitCustom(open, newHigh, newLow, newVol);
  };

  const isSingleVariable = model?.key === 'linear';

  return (
    <div className="form-card-glass">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sliders size={20} style={{ color: 'var(--neon-cyan)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Market Feature Simulator</h3>
        </div>
        {isCustomInput && (
          <span className="sub-badge sub-badge-purple">Custom Scenario</span>
        )}
      </div>

      {/* Preset Quick Actions */}
      <div className="preset-pills-row">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PRESETS:</span>
        <button type="button" className="preset-pill-btn" onClick={handlePresetBullish}>
          <TrendingUp size={12} style={{ color: 'var(--neon-emerald)' }} /> Bullish (+5%)
        </button>
        <button type="button" className="preset-pill-btn" onClick={handlePresetBearish}>
          <TrendingDown size={12} style={{ color: 'var(--neon-rose)' }} /> Bearish (-5%)
        </button>
        {!isSingleVariable && (
          <button type="button" className="preset-pill-btn" onClick={handlePresetHighVol}>
            <Activity size={12} style={{ color: 'var(--neon-amber)' }} /> Volatility Spike
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Open Price */}
        <div className="form-group">
          <div className="form-label-row">
            <label className="form-label">Session Open Price ({currency})</label>
            <span className="mono-font" style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>
              {open ? formatNumber(open, 2) : '0.00'}
            </span>
          </div>
          <input
            type="number"
            step="any"
            className="form-input-number"
            value={open}
            onChange={(e) => setOpen(e.target.value)}
            placeholder="e.g. 2950.50"
            required
          />
        </div>

        {!isSingleVariable && (
          <>
            {/* High Price */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Intraday Peak High ({currency})</label>
                <span className="mono-font" style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>
                  {high ? formatNumber(high, 2) : '0.00'}
                </span>
              </div>
              <input
                type="number"
                step="any"
                className="form-input-number"
                value={high}
                onChange={(e) => setHigh(e.target.value)}
                placeholder="e.g. 2980.00"
              />
            </div>

            {/* Low Price */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Intraday Trough Low ({currency})</label>
                <span className="mono-font" style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>
                  {low ? formatNumber(low, 2) : '0.00'}
                </span>
              </div>
              <input
                type="number"
                step="any"
                className="form-input-number"
                value={low}
                onChange={(e) => setLow(e.target.value)}
                placeholder="e.g. 2930.00"
              />
            </div>

            {/* Trading Volume */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Trading Volume (Units)</label>
                <span className="mono-font" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {volume ? formatNumber(volume, 0) : '0'}
                </span>
              </div>
              <input
                type="number"
                step="any"
                className="form-input-number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g. 1500000"
              />
            </div>
          </>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
            {loading ? <RefreshCw size={16} className="spin-icon" /> : <Zap size={16} />}
            <span>{loading ? 'Calculating...' : 'Execute ML Prediction'}</span>
          </button>
          {isCustomInput && (
            <button type="button" className="btn btn-secondary" onClick={onResetRealtime} title="Reset to Live Market Feed">
              <RefreshCw size={16} />
              <span>Reset Feed</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;

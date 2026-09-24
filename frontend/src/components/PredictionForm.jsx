import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, Calculator, Info } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

const PredictionForm = ({
  model,
  marketData,
  currency = 'USD',
  isCustomInput,
  onSubmitCustom,
  onResetRealtime,
  loading,
}) => {
  const [openVal, setOpenVal] = useState('');
  const [highVal, setHighVal] = useState('');
  const [lowVal, setLowVal] = useState('');
  const [volumeVal, setVolumeVal] = useState('');
  const [mode, setMode] = useState('realtime'); // 'realtime' or 'custom'

  useEffect(() => {
    if (marketData) {
      setOpenVal(marketData.open !== undefined ? String(marketData.open) : '');
      setHighVal(marketData.high !== undefined ? String(marketData.high) : '');
      setLowVal(marketData.low !== undefined ? String(marketData.low) : '');
      setVolumeVal(marketData.volume !== undefined ? String(marketData.volume) : '');
    }
  }, [marketData]);

  if (!marketData) return null;

  const requiresOnlyOpen = model?.key === 'linear';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!openVal || isNaN(openVal) || Number(openVal) <= 0) {
      alert('Please enter a valid positive Opening price.');
      return;
    }
    onSubmitCustom(
      openVal,
      requiresOnlyOpen ? openVal : highVal,
      requiresOnlyOpen ? openVal : lowVal,
      requiresOnlyOpen ? '0' : volumeVal
    );
  };

  return (
    <div className="prediction-form-card">
      <div className="form-card-header">
        <div className="form-title-group">
          <Sliders size={20} className="form-title-icon" />
          <div>
            <h3 className="form-card-title">Prediction Parameters & Inputs</h3>
            <p className="form-card-sub">
              {requiresOnlyOpen
                ? 'Simple Linear Regression requires only the Opening Market Price feature.'
                : 'Multivariate model accepts Open, High, Low, and Trading Volume features.'}
            </p>
          </div>
        </div>
        <div className="form-mode-tabs">
          <button
            type="button"
            className={`mode-tab-btn ${!isCustomInput && mode === 'realtime' ? 'active' : ''}`}
            onClick={() => {
              setMode('realtime');
              if (isCustomInput) onResetRealtime();
            }}
          >
            Real-Time Data
          </button>
          <button
            type="button"
            className={`mode-tab-btn ${isCustomInput || mode === 'custom' ? 'active' : ''}`}
            onClick={() => setMode('custom')}
          >
            Custom What-If Inputs
          </button>
        </div>
      </div>

      {mode === 'realtime' && !isCustomInput ? (
        <div className="realtime-values-summary">
          <div className="summary-banner">
            <Info size={16} className="info-icon" />
            <span>Currently using real-time market data fetched from live exchange feed:</span>
          </div>
          <div className="values-grid">
            <div className="value-box highlight">
              <span className="box-label">Open Price</span>
              <span className="box-value">{formatCurrency(marketData.open, currency)}</span>
            </div>
            {!requiresOnlyOpen && (
              <>
                <div className="value-box">
                  <span className="box-label">Daily High</span>
                  <span className="box-value">{formatCurrency(marketData.high, currency)}</span>
                </div>
                <div className="value-box">
                  <span className="box-label">Daily Low</span>
                  <span className="box-value">{formatCurrency(marketData.low, currency)}</span>
                </div>
                <div className="value-box">
                  <span className="box-label">Volume</span>
                  <span className="box-value">{formatNumber(marketData.volume, 0)}</span>
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm switch-to-custom-btn"
            onClick={() => setMode('custom')}
          >
            <Calculator size={14} /> Customize Input Values
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="custom-feature-form">
          <div className="input-fields-grid">
            <div className="form-field-group">
              <label className="field-label">
                Open Price ({currency}) <span className="required-star">*</span>
              </label>
              <input
                type="number"
                step="any"
                required
                className="form-input"
                value={openVal}
                onChange={(e) => setOpenVal(e.target.value)}
                placeholder="e.g. 1250.50"
              />
              <span className="field-hint">Opening price at session start</span>
            </div>

            {!requiresOnlyOpen && (
              <>
                <div className="form-field-group">
                  <label className="field-label">Daily High ({currency})</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    value={highVal}
                    onChange={(e) => setHighVal(e.target.value)}
                    placeholder="e.g. 1265.00"
                  />
                  <span className="field-hint">Highest price during session</span>
                </div>

                <div className="form-field-group">
                  <label className="field-label">Daily Low ({currency})</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    value={lowVal}
                    onChange={(e) => setLowVal(e.target.value)}
                    placeholder="e.g. 1240.00"
                  />
                  <span className="field-hint">Lowest price during session</span>
                </div>

                <div className="form-field-group">
                  <label className="field-label">Trading Volume</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    value={volumeVal}
                    onChange={(e) => setVolumeVal(e.target.value)}
                    placeholder="e.g. 5000000"
                  />
                  <span className="field-hint">Total traded unit volume</span>
                </div>
              </>
            )}
          </div>

          <div className="form-actions-row">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="spinner" /> Calculating...
                </>
              ) : (
                <>
                  <Calculator size={15} /> Execute {model?.name || 'Model'} Prediction
                </>
              )}
            </button>
            {isCustomInput && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setMode('realtime');
                  onResetRealtime();
                }}
              >
                <RefreshCw size={14} /> Reset to Live Real-time Data
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default PredictionForm;

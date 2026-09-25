import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, ShieldCheck, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';

const PredictionResult = ({
  modelKey,
  modelName,
  predictionData,
  currency = 'USD',
  loading = false,
  error = null,
}) => {
  if (loading) {
    return (
      <div className="result-card-glass" style={{ minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textTransform: 'center', color: 'var(--neon-cyan)' }}>
          <Sparkles size={36} className="spin-icon" style={{ marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Executing ML Inference Pipeline...</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            Evaluating market vector against trained weights
          </p>
        </div>
      </div>
    );
  }

  if (error || !predictionData || !predictionData.predictions) {
    return (
      <div className="result-card-glass" style={{ minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <AlertCircle size={40} style={{ color: 'var(--neon-rose)', marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--neon-rose)' }}>Prediction Data Unavailable</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '340px' }}>
            {error || 'Make sure the FastAPI backend server is running on http://localhost:8000.'}
          </p>
        </div>
      </div>
    );
  }

  const modelPrediction = predictionData.predictions[modelKey] || Object.values(predictionData.predictions)[0];
  if (!modelPrediction) return null;

  const { predicted_close, diff_from_open, percentage_diff, evaluation_metrics } = modelPrediction;
  const isPositive = diff_from_open >= 0;
  const isBestModel = predictionData.recommended_best_model === modelKey;

  return (
    <div className="result-card-glass">
      <div>
        {/* Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span className="sub-badge">PREDICTED CLOSING PRICE</span>
          {isBestModel && (
            <span className="best-ribbon font-badge">
              <Award size={12} /> Best Model Regressor
            </span>
          )}
        </div>

        {/* Model Identifier */}
        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {modelName}
        </h4>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {predictionData.timestamp || 'Live Feed'} • Market Quote ({predictionData.asset_name || 'Asset'})
        </div>

        {/* Predicted Price Display */}
        <div className="result-price-big">
          {formatCurrency(predicted_close, currency)}
        </div>

        {/* Delta change vs Open */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className={`result-delta-badge ${isPositive ? 'delta-positive' : 'delta-negative'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>
              {isPositive ? '+' : ''}
              {formatCurrency(diff_from_open, currency)} ({formatPercent(percentage_diff)})
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>vs Input Open Price</span>
        </div>
      </div>

      {/* Model Accuracy & Confidence Stats */}
      <div style={{ background: 'rgba(5, 9, 18, 0.6)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MODEL METRICS</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>HOLDOUT TEST</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>R² Score</div>
            <div className="mono-font" style={{ fontSize: '1.1rem', fontWeight: 700, color: evaluation_metrics?.r2_percentage > 90 ? 'var(--neon-emerald)' : 'var(--neon-cyan)' }}>
              {evaluation_metrics?.r2_percentage ? formatNumber(evaluation_metrics.r2_percentage, 2) + '%' : 'N/A'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MAE Error</div>
            <div className="mono-font" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {evaluation_metrics?.mae ? formatCurrency(evaluation_metrics.mae, currency) : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;

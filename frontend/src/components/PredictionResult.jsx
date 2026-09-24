import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Award,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

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
      <div className="prediction-result-card loading-state">
        <Loader2 size={36} className="spinner loading-icon" />
        <h4>Calculating ML Model Inference...</h4>
        <p>Processing feature engineering pipeline and executing model evaluation.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prediction-result-card error-state">
        <AlertCircle size={32} className="error-icon" />
        <h4>Prediction Calculation Error</h4>
        <p>{error}</p>
      </div>
    );
  }

  if (!predictionData || !predictionData.predictions) return null;

  const pred = predictionData.predictions[modelKey];
  if (!pred) return null;

  const isRecommended = predictionData.recommended_best_model === modelKey;
  const isPositive = pred.diff_from_open > 0;
  const isNegative = pred.diff_from_open < 0;

  return (
    <div className={`prediction-result-card success-state ${isRecommended ? 'recommended-card' : ''}`}>
      {isRecommended && (
        <div className="result-recommended-banner">
          <Award size={15} /> Validated Best Recommended Model
        </div>
      )}

      <div className="result-header">
        <div>
          <span className="result-badge">Prediction Output</span>
          <h2 className="result-model-name">{pred.model_name || modelName}</h2>
        </div>
        <div className="result-features-pill">
          Features: {pred.features_used?.join(', ')}
        </div>
      </div>

      <div className="result-main-display">
        <div className="predicted-price-block">
          <span className="price-label">Predicted Session Close Price</span>
          <div className="price-value-row">
            <span className="price-number">
              {formatCurrency(pred.predicted_close, currency)}
            </span>
            <Sparkles size={20} className="sparkle-icon" />
          </div>
        </div>

        <div className="price-change-block">
          <span className="change-label">Estimated Direction vs Open</span>
          <div className={`change-pill ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
            {isPositive && <ArrowUpRight size={18} />}
            {isNegative && <ArrowDownRight size={18} />}
            {!isPositive && !isNegative && <Minus size={18} />}
            <span className="change-amount">
              {isPositive ? '+' : ''}
              {formatCurrency(pred.diff_from_open, currency)}
            </span>
            <span className="change-percentage">({formatPercent(pred.percentage_diff)})</span>
          </div>
        </div>
      </div>

      <div className="result-meta-row">
        <div className="meta-item">
          <span className="meta-label">Input Session Open</span>
          <span className="meta-val">{formatCurrency(pred.open_price, currency)}</span>
        </div>

        {predictionData.market_data?.high && (
          <div className="meta-item">
            <span className="meta-label">Reference High</span>
            <span className="meta-val">{formatCurrency(predictionData.market_data.high, currency)}</span>
          </div>
        )}

        {predictionData.market_data?.low && (
          <div className="meta-item">
            <span className="meta-label">Reference Low</span>
            <span className="meta-val">{formatCurrency(predictionData.market_data.low, currency)}</span>
          </div>
        )}

        <div className="meta-item">
          <span className="meta-label">Model Status</span>
          <span className="meta-status">
            <CheckCircle2 size={13} className="success-icon" /> Inferred Successfully
          </span>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;

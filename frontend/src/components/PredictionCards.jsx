import React from 'react';
import { Award, ArrowUpRight, ArrowDownRight, Minus, Sparkles } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

const PredictionCards = ({ predictionData }) => {
  if (!predictionData || !predictionData.predictions) return null;

  const { currency, recommended_best_model, predictions } = predictionData;
  const modelKeys = Object.keys(predictions);

  return (
    <div className="prediction-section">
      <div className="section-header">
        <div className="title-with-badge">
          <Sparkles className="section-icon" size={22} />
          <h2>Multi-Model Price Predictions</h2>
        </div>
        <p className="section-desc">
          Current day predicted closing prices computed across 6 distinct ML algorithms
        </p>
      </div>

      <div className="prediction-grid">
        {modelKeys.map((key) => {
          const pred = predictions[key];
          const isRecommended = key === recommended_best_model;
          const isPositive = pred.diff_from_open > 0;
          const isNegative = pred.diff_from_open < 0;

          return (
            <div
              key={key}
              className={`glass-card prediction-card ${isRecommended ? 'recommended-card' : ''}`}
            >
              {isRecommended && (
                <div className="recommended-ribbon">
                  <Award size={14} /> Recommended Model
                </div>
              )}

              <div className="card-top">
                <h4 className="model-card-name">{pred.model_name}</h4>
                <div className="features-chip">
                  Features: {pred.features_used.join(', ')}
                </div>
              </div>

              <div className="prediction-main-val">
                <span className="pred-label">Predicted Close</span>
                <span className="pred-amount">
                  {formatCurrency(pred.predicted_close, currency)}
                </span>
              </div>

              <div className="prediction-diff-bar">
                <div className={`diff-pill ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
                  {isPositive && <ArrowUpRight size={16} />}
                  {isNegative && <ArrowDownRight size={16} />}
                  {!isPositive && !isNegative && <Minus size={16} />}
                  <span className="diff-val">
                    {pred.diff_from_open > 0 ? '+' : ''}
                    {formatCurrency(pred.diff_from_open, currency)}
                  </span>
                  <span className="diff-pct">({formatPercent(pred.percentage_diff)})</span>
                </div>
              </div>

              <div className="card-footer-note">
                Input Open: {formatCurrency(pred.open_price, currency)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PredictionCards;

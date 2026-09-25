import React from 'react';
import { Link } from '../router/RouterContext';
import {
  TrendingUp,
  Layers,
  Activity,
  Shield,
  Trees,
  Zap,
  Award,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { formatNumber } from '../utils/formatters';

const ICON_MAP = {
  TrendingUp,
  Layers,
  Activity,
  Shield,
  Trees,
  Zap,
};

const ModelCard = ({ model, isRecommended = false, r2Score, mae, currency = 'USD' }) => {
  const IconComponent = ICON_MAP[model.iconName] || TrendingUp;

  return (
    <div className={`model-card-futuristic ${isRecommended ? 'is-best' : ''}`}>
      <div>
        {/* Top Header */}
        <div className="model-card-header">
          <div className="model-card-icon">
            <IconComponent size={24} />
          </div>
          {isRecommended && (
            <span className="best-ribbon font-badge">
              <Award size={13} /> Recommended Best Model
            </span>
          )}
        </div>

        {/* Title & Category */}
        <h3 className="model-card-title">{model.name}</h3>
        <div className="model-card-category">{model.category}</div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.75rem', lineHeight: '1.5' }}>
          {model.shortDesc}
        </p>

        {/* Mathematical Formula Chip */}
        <div className="model-card-formula">
          <code>{model.formulaDisplay || model.formula}</code>
        </div>
      </div>

      {/* Accuracy Metrics */}
      <div>
        {(r2Score !== undefined || mae !== undefined) && (
          <div className="model-card-metrics">
            {r2Score !== undefined && (
              <div className="card-metric-block">
                <span className="card-metric-label">Holdout R² Accuracy</span>
                <span className="card-metric-val" style={{ color: r2Score > 95 ? 'var(--neon-emerald)' : 'var(--neon-cyan)' }}>
                  {formatNumber(r2Score, 2)}%
                </span>
              </div>
            )}
            {mae !== undefined && (
              <div className="card-metric-block">
                <span className="card-metric-label">MAE ({currency})</span>
                <span className="card-metric-val">{formatNumber(mae, 2)}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="model-card-actions">
          <Link to={`/models/${model.slug}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
            <span>Predict Live</span>
            <ArrowRight size={14} />
          </Link>
          <Link to={`/models/${model.slug}/about`} className="btn btn-secondary btn-sm">
            <BookOpen size={14} />
            <span>Math Specs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;

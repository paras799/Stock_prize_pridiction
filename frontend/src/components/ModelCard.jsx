import React from 'react';
import { Link } from '../router/RouterContext';
import {
  TrendingUp,
  Layers,
  Activity,
  Shield,
  Trees,
  Zap,
  ArrowRight,
  BookOpen,
  Award,
} from 'lucide-react';

const ICON_MAP = {
  TrendingUp: TrendingUp,
  Layers: Layers,
  Activity: Activity,
  Shield: Shield,
  Trees: Trees,
  Zap: Zap,
};

const ModelCard = ({ model, isRecommended = false, r2Score, mae, currency = 'USD' }) => {
  const IconComponent = ICON_MAP[model.iconName] || Activity;

  return (
    <div className={`model-card-item ${isRecommended ? 'recommended-highlight' : ''}`}>
      {isRecommended && (
        <div className="card-recommended-badge">
          <Award size={13} /> Recommended Model
        </div>
      )}

      <div className="card-top-header">
        <div className="card-icon-box">
          <IconComponent size={20} className="card-icon" />
        </div>
        <div>
          <span className="card-category-tag">{model.category}</span>
          <h3 className="card-title">{model.name}</h3>
        </div>
      </div>

      <p className="card-description">{model.shortDesc}</p>

      <div className="card-concept-box">
        <span className="concept-label">Equation Concept:</span>
        <code className="concept-formula">{model.formulaDisplay}</code>
      </div>

      <div className="card-features-tag">
        <span className="features-label">Features Used:</span>
        <div className="feature-pills">
          {model.features.map((feat) => (
            <span key={feat} className="feature-pill">
              {feat}
            </span>
          ))}
        </div>
      </div>

      {r2Score !== undefined && (
        <div className="card-metrics-row">
          <div className="card-metric-stat">
            <span className="stat-label">Holdout R²</span>
            <span className="stat-val">{r2Score > 0 ? `${r2Score.toFixed(1)}%` : 'N/A'}</span>
          </div>
          {mae !== undefined && (
            <div className="card-metric-stat">
              <span className="stat-label">MAE ({currency})</span>
              <span className="stat-val">{mae.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      <div className="card-actions">
        <Link to={`/models/${model.slug}`} className="btn btn-primary btn-sm">
          <span>Predict</span>
          <ArrowRight size={14} />
        </Link>
        <Link to={`/models/${model.slug}/about`} className="btn btn-secondary btn-sm">
          <BookOpen size={14} />
          <span>About Model</span>
        </Link>
      </div>
    </div>
  );
};

export default ModelCard;

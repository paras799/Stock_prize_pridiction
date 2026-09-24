import React from 'react';
import {
  TrendingUp,
  Layers,
  Activity,
  Shield,
  Trees,
  Zap,
  Cpu,
} from 'lucide-react';

const ICON_MAP = {
  TrendingUp: TrendingUp,
  Layers: Layers,
  Activity: Activity,
  Shield: Shield,
  Trees: Trees,
  Zap: Zap,
};

const ModelHeader = ({ model, assetName }) => {
  const IconComponent = ICON_MAP[model?.iconName] || Activity;

  return (
    <div className="model-page-header">
      <div className="header-left">
        <div className="model-header-icon-box">
          <IconComponent size={28} className="header-icon" />
        </div>
        <div>
          <div className="header-badge-row">
            <span className="category-badge">{model?.category}</span>
            <span className="prediction-mode-badge">
              <Cpu size={12} /> Stock-Price Prediction Engine
            </span>
          </div>
          <h1 className="model-header-title">{model?.name}</h1>
          <p className="model-header-desc">{model?.shortDesc}</p>
        </div>
      </div>
      {assetName && (
        <div className="header-asset-chip">
          <span className="chip-label">Active Asset:</span>
          <span className="chip-value">{assetName}</span>
        </div>
      )}
    </div>
  );
};

export default ModelHeader;

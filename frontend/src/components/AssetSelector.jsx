import React from 'react';
import { TrendingUp, Coins, Globe, Check } from 'lucide-react';

const ASSET_ICONS = {
  reliance: TrendingUp,
  bitcoin: Coins,
  google: Globe,
};

const AssetSelector = ({ assets = [], selectedAssetId, onSelectAsset }) => {
  if (!assets || assets.length === 0) return null;

  return (
    <div className="asset-selector-pills-grid">
      {assets.map((asset) => {
        const IconComponent = ASSET_ICONS[asset.id] || TrendingUp;
        const isSelected = selectedAssetId === asset.id;
        const displaySymbol = asset.symbol || asset.symbol_twelve_data || asset.id.toUpperCase();

        return (
          <button
            key={asset.id}
            type="button"
            className={`asset-pill-card ${isSelected ? 'active-selected' : ''}`}
            onClick={() => onSelectAsset(asset.id)}
          >
            <div className="asset-pill-icon-box">
              <IconComponent size={18} />
            </div>
            <div className="asset-pill-info">
              <span className="asset-pill-name">{asset.name}</span>
              <span className="asset-pill-symbol">
                {displaySymbol} • {asset.currency || 'USD'}
              </span>
            </div>
            {isSelected && (
              <div className="asset-pill-check">
                <Check size={14} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AssetSelector;

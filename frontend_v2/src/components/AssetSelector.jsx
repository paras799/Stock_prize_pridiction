import React from 'react';
import { Database, Coins, Building2, TrendingUp } from 'lucide-react';

const AssetSelector = ({ assets = [], selectedAssetId, onSelectAsset }) => {
  const getAssetIcon = (symbol = '') => {
    if (symbol.includes('BTC') || symbol.includes('CRYPTO')) return Coins;
    if (symbol.includes('RELIANCE') || symbol.includes('NSE')) return Building2;
    return TrendingUp;
  };

  return (
    <div className="asset-selector-bar">
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Select Market Asset:
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {assets.map((asset) => {
          const isSelected = asset.id === selectedAssetId;
          const IconComponent = getAssetIcon(asset.symbol || asset.name);

          return (
            <div
              key={asset.id}
              className={`asset-pill ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectAsset(asset.id)}
            >
              <IconComponent size={16} style={{ color: isSelected ? 'var(--neon-cyan)' : 'var(--text-muted)' }} />
              <span style={{ fontWeight: 600 }}>{asset.name}</span>
              <span className="asset-pill-symbol">{asset.symbol}</span>
              <span style={{ fontSize: '0.75rem', color: isSelected ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>
                ({asset.currency})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetSelector;

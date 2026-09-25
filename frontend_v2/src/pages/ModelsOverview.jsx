import React, { useState } from 'react';
import { MODELS_LIST } from '../data/modelsData';
import ModelCard from '../components/ModelCard';
import ModelComparisonTable from '../components/ModelComparisonTable';
import FinancialChart from '../components/FinancialChart';
import AssetSelector from '../components/AssetSelector';
import { BarChart2, Cpu, Filter } from 'lucide-react';

const ModelsOverview = ({
  assets = [],
  selectedAssetId,
  onSelectAsset,
  comparisonData,
  historicalData,
  predictionData,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const currency = predictionData?.currency || selectedAsset?.currency || 'USD';

  // Filter models by category if filter selected
  const filteredModels = MODELS_LIST.filter((model) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'LINEAR') return model.category.includes('Linear');
    if (selectedCategory === 'ENSEMBLE') return model.category.includes('Ensemble') || model.category.includes('Boosting');
    if (selectedCategory === 'KERNEL') return model.category.includes('Kernel') || model.category.includes('Non-Linear');
    return true;
  });

  return (
    <div className="container-xl" style={{ paddingTop: '2.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <span className="sub-badge">REGRESSOR MATRIX</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
            Machine Learning Models Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '700px', marginTop: '0.4rem' }}>
            Explore and benchmark all 6 regression algorithms implemented in our predictive suite for <strong style={{ color: 'var(--neon-cyan)' }}>{selectedAsset?.name || 'Selected Asset'}</strong>.
          </p>
        </div>

        {/* Asset Selector */}
        {assets.length > 0 && (
          <AssetSelector
            assets={assets}
            selectedAssetId={selectedAssetId}
            onSelectAsset={onSelectAsset}
          />
        )}
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Filter size={14} /> FILTER CATEGORY:
        </span>
        {[
          { id: 'ALL', label: 'All 6 Models' },
          { id: 'LINEAR', label: 'Linear Regressors' },
          { id: 'ENSEMBLE', label: 'Tree Ensembles & Boosting' },
          { id: 'KERNEL', label: 'SVR & Non-Linear' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`preset-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            style={
              selectedCategory === cat.id
                ? { background: 'rgba(0, 240, 255, 0.15)', borderColor: 'rgba(0, 240, 255, 0.4)', color: 'var(--neon-cyan)' }
                : {}
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Models Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="models-cards-grid">
          {filteredModels.map((model) => {
            const compMetric = comparisonData?.models?.find((m) => m.model_key === model.key);
            const isBest = model.key === comparisonData?.recommended_best_model;

            return (
              <ModelCard
                key={model.key}
                model={model}
                isRecommended={isBest}
                r2Score={compMetric?.r2_percentage}
                mae={compMetric?.mae}
                currency={currency}
              />
            );
          })}
        </div>
      </section>

      {/* Comparison Metrics Section */}
      {comparisonData && comparisonData.models && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <BarChart2 size={24} style={{ color: 'var(--neon-cyan)' }} />
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Holdout Test Evaluation & Benchmark Matrix</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Quantitative metrics computed chronologically on 15% holdout test dataset for {comparisonData.asset_name || selectedAssetId}.
              </p>
            </div>
          </div>

          <ModelComparisonTable comparisonData={comparisonData} currency={currency} />
        </section>
      )}

      {/* Interactive Financial Time-Series Chart */}
      <section style={{ marginBottom: '3rem' }}>
        <FinancialChart
          historicalData={historicalData}
          metadata={predictionData}
          comparisonData={comparisonData}
          currency={currency}
          assetName={selectedAsset?.name}
        />
      </section>
    </div>
  );
};

export default ModelsOverview;

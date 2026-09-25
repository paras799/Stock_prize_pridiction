import React from 'react';
import { getModelBySlug, MODELS_LIST } from '../data/modelsData';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import FinancialChart from '../components/FinancialChart';
import HoldoutValidationChart from '../components/HoldoutValidationChart';
import AssetSelector from '../components/AssetSelector';
import { Link } from '../router/RouterContext';
import { Sparkles, Layers, AlertCircle, Award, ArrowRight, BookOpen, Sliders, Activity } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

const ModelPage = ({
  slug,
  assets = [],
  selectedAssetId,
  onSelectAsset,
  predictionData,
  historicalData,
  comparisonData,
  loading,
  error,
  isCustomInput,
  onCustomPrediction,
  onResetRealtime,
}) => {
  const model = getModelBySlug(slug) || MODELS_LIST[0];
  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const currency = predictionData?.currency || selectedAsset?.currency || 'USD';

  // Extract other model predictions for comparative reference
  const otherPredictions = predictionData?.predictions
    ? Object.keys(predictionData.predictions)
        .filter((k) => k !== model.key)
        .slice(0, 3)
        .map((k) => predictionData.predictions[k])
    : [];

  return (
    <div className="container-xl" style={{ paddingTop: '2rem' }}>
      {/* Sub-Header Navigation Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="sub-badge">{model.category}</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{model.name} Workspace</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/models/${model.slug}`} className="btn btn-primary btn-sm">
            <Sliders size={14} /> Live Simulator
          </Link>
          <Link to={`/models/${model.slug}/about`} className="btn btn-secondary btn-sm">
            <BookOpen size={14} /> Mathematical Specs
          </Link>
        </div>
      </div>

      {/* Target Asset Switcher */}
      {assets.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <AssetSelector
            assets={assets}
            selectedAssetId={selectedAssetId}
            onSelectAsset={onSelectAsset}
          />
        </section>
      )}

      {/* Backend Communication Warning */}
      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--neon-rose)' }}>
          <AlertCircle size={22} />
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Backend Server Warning</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{error}</p>
          </div>
        </div>
      )}

      {/* Prediction Workspace 2-Column Grid */}
      <section className="prediction-workspace-grid">
        {/* Left Form */}
        <PredictionForm
          model={model}
          marketData={predictionData?.market_data}
          currency={currency}
          isCustomInput={isCustomInput}
          onSubmitCustom={onCustomPrediction}
          onResetRealtime={onResetRealtime}
          loading={loading}
        />

        {/* Right Result Card */}
        <PredictionResult
          modelKey={model.key}
          modelName={model.name}
          predictionData={predictionData}
          currency={currency}
          loading={loading}
          error={error}
        />
      </section>

      {/* Other Models Comparison Preview Row */}
      {predictionData && predictionData.predictions && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Layers size={20} style={{ color: 'var(--neon-cyan)' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Simultaneous Predictions across Alternative Regressors</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                How other trained models evaluate the exact same market input vector for {selectedAsset?.name}:
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {otherPredictions.map((other) => {
              const otherModelObj = MODELS_LIST.find((m) => m.key === other.model_key);
              const isBest = predictionData.recommended_best_model === other.model_key;

              return (
                <div key={other.model_key} className="glass-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{other.model_name}</span>
                    {isBest && (
                      <span className="best-ribbon font-badge">
                        <Award size={10} /> Best
                      </span>
                    )}
                  </div>
                  <div className="mono-font" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.4rem 0' }}>
                    {formatCurrency(other.predicted_close, currency)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: other.diff_from_open >= 0 ? 'var(--neon-emerald)' : 'var(--neon-rose)', fontFamily: 'var(--font-mono)' }}>
                    Diff vs Open: {other.diff_from_open >= 0 ? '+' : ''}{formatCurrency(other.diff_from_open, currency)} ({formatPercent(other.percentage_diff)})
                  </div>
                  {otherModelObj && (
                    <Link to={`/models/${otherModelObj.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--neon-cyan)', marginTop: '0.75rem', textDecoration: 'none' }}>
                      Switch to {otherModelObj.name} <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Dedicated Holdout Test Validation Chart */}
      <section style={{ marginBottom: '3rem' }}>
        <HoldoutValidationChart assetId={selectedAssetId} modelKey={model.key} currency={currency} />
      </section>

      {/* Main Historical Chart */}
      <section style={{ marginBottom: '3rem' }}>
        <FinancialChart
          historicalData={historicalData}
          metadata={predictionData}
          comparisonData={comparisonData}
          currency={currency}
          assetName={selectedAsset?.name}
          selectedModelKey={model.key}
        />
      </section>

      {/* Educational Banner Link */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', background: 'radial-gradient(circle at 0% 50%, rgba(0, 240, 255, 0.1) 0%, rgba(15, 23, 42, 0.6) 80%)' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Want to learn the mathematical mechanics of {model.name}?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Read our step-by-step breakdown of feature inputs, equations, OLS/kernel fitting, and model limitations.
            </p>
          </div>
          <Link to={`/models/${model.slug}/about`} className="btn btn-primary">
            <Sparkles size={16} /> Read Math Specs for {model.name}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ModelPage;

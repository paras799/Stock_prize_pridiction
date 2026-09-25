import React from 'react';
import { Link } from '../router/RouterContext';
import { MODELS_LIST } from '../data/modelsData';
import ModelCard from '../components/ModelCard';
import WorkflowDiagram from '../components/WorkflowDiagram';
import MetricCard from '../components/MetricCard';
import AssetSelector from '../components/AssetSelector';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Cpu,
  Database,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Sliders,
  CheckCircle2,
  Zap,
} from 'lucide-react';

const Home = ({ assets = [], selectedAssetId, onSelectAsset, comparisonData }) => {
  return (
    <div className="container-xl" style={{ paddingTop: '2rem' }}>
      {/* 1. Futuristic Glass Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-glass-box">
          <div className="hero-pill-badge">
            <Sparkles size={14} />
            <span>AI-POWERED QUANTITATIVE PLATFORM v2.0</span>
          </div>

          <h1 className="hero-headline">
            Stock Price Prediction with <br />
            <span className="gradient-text">Machine Learning Intelligence</span>
          </h1>

          <p className="hero-subtitle">
            Evaluate intraday market indicators, analyze historical financial time-series data, and generate data-driven daily closing price forecasts across six distinct statistical ML algorithms.
          </p>

          <div className="hero-cta-group">
            <Link to="/models" className="btn btn-primary btn-lg">
              <span>Start Predicting</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              <BookOpen size={18} />
              <span>Explore Platform Specs</span>
            </Link>
          </div>

          {/* Quick Stats Ticker Grid */}
          <div className="hero-metrics-grid">
            <MetricCard
              label="Available Regressors"
              value="6 ML Models"
              subtext="Linear, SVR, Trees & Boosting"
              icon={Cpu}
              color="cyan"
            />
            <MetricCard
              label="Supported Markets"
              value={`${assets.length || 3} Assets`}
              subtext="Reliance, Bitcoin, Google"
              icon={Database}
              color="purple"
            />
            <MetricCard
              label="Holdout Test Split"
              value="85 / 15 Split"
              subtext="Chronological Time-Series Validation"
              icon={ShieldCheck}
              color="emerald"
            />
            <MetricCard
              label="Data Feed Integration"
              value="Real-Time Sync"
              subtext="Live exchange market data"
              icon={TrendingUp}
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* 2. Target Market Switcher */}
      {assets.length > 0 && (
        <section style={{ margin: '2rem 0' }}>
          <AssetSelector
            assets={assets}
            selectedAssetId={selectedAssetId}
            onSelectAsset={onSelectAsset}
          />
        </section>
      )}

      {/* 3. Platform Value Propositions */}
      <section className="section-wrapper">
        <div className="section-header-center">
          <span className="sub-badge">QUANTITATIVE CORE</span>
          <h2 className="section-title">Data-Driven Financial Intelligence</h2>
          <p className="section-desc">
            Combining rigorous statistical time-series methodology with real-time exchange data for transparent predictions.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div className="glass-card glass-card-hover">
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <BarChart3 size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Intraday Market Analysis</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Synthesizes session Open, High, Low, and trading Volume data to capture market momentum and price volatility.
            </p>
          </div>

          <div className="glass-card glass-card-hover">
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--neon-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Sliders size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Multi-Algorithm Comparison</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Compare single-variable linear models against high-dimensional Support Vector Regression and decision tree ensembles.
            </p>
          </div>

          <div className="glass-card glass-card-hover">
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--neon-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <CheckCircle2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Holdout Out-of-Sample Testing</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Every model is validated on unseen holdout test records with transparent R² accuracy scores and Mean Absolute Error (MAE).
            </p>
          </div>
        </div>
      </section>

      {/* 4. System Pipeline Diagram */}
      <section className="section-wrapper">
        <WorkflowDiagram title="Machine Learning Inference Pipeline" />
      </section>

      {/* 5. ML Models Portfolio Grid */}
      <section className="section-wrapper">
        <div className="section-header-between">
          <div>
            <span className="sub-badge">ALGORITHM PORTFOLIO</span>
            <h2 className="section-title">Available Machine Learning Models</h2>
            <p className="section-desc">
              Select any regressor to execute live predictions or inspect detailed mathematical specifications.
            </p>
          </div>
          <Link to="/models" className="btn btn-outline btn-sm">
            <span>View Comparison Matrix</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="models-cards-grid">
          {MODELS_LIST.map((model) => {
            const compMetric = comparisonData?.models?.find((m) => m.model_key === model.key);
            const isBest = model.key === comparisonData?.recommended_best_model;
            return (
              <ModelCard
                key={model.key}
                model={model}
                isRecommended={isBest}
                r2Score={compMetric?.r2_percentage}
                mae={compMetric?.mae}
                currency={comparisonData?.currency || 'USD'}
              />
            );
          })}
        </div>
      </section>

      {/* 6. Technology Architecture Showcase */}
      <section className="section-wrapper">
        <div className="section-header-center">
          <span className="sub-badge">SYSTEM ARCHITECTURE</span>
          <h2 className="section-title">Technology Stack</h2>
          <p className="section-desc">
            Built using modern open-source quantitative frameworks for high performance and numerical reproducibility.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          <div className="glass-card">
            <div className="sub-badge" style={{ marginBottom: '0.75rem' }}>Frontend</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>React 19 & Vite</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Futuristic glassmorphism SPA client with modern CSS design tokens.</p>
          </div>
          <div className="glass-card">
            <div className="sub-badge sub-badge-purple" style={{ marginBottom: '0.75rem' }}>Backend API</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>FastAPI Python</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>High-concurrency REST API serving trained scikit-learn model artifacts.</p>
          </div>
          <div className="glass-card">
            <div className="sub-badge sub-badge-emerald" style={{ marginBottom: '0.75rem' }}>Intelligence</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Scikit-Learn ML</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pipelines for Linear Regression, SVR, Random Forest, & Gradient Boosting.</p>
          </div>
          <div className="glass-card">
            <div className="sub-badge" style={{ marginBottom: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: 'var(--neon-amber)' }}>Visuals</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Recharts & Canvas</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Interactive TradingView financial time-series charts & holdout graphs.</p>
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="section-wrapper" style={{ marginBottom: '2rem' }}>
        <div className="hero-glass-box" style={{ padding: '3.5rem 2rem', background: 'radial-gradient(circle at 50% 100%, rgba(168, 85, 247, 0.15) 0%, rgba(15, 23, 42, 0.8) 70%)' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Explore Stock Price Predictions?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
            Choose any algorithm to test real-time predictions, analyze custom what-if market scenarios, or inspect algorithm specifications.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/models" className="btn btn-primary btn-lg">
              <span>Start Predicting Now</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              <BookOpen size={18} />
              <span>Read Documentation</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

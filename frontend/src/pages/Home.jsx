import React from 'react';
import { Link } from '../router/RouterContext';
import { MODELS_LIST } from '../data/modelsData';
import ModelCard from '../components/ModelCard';
import WorkflowDiagram from '../components/WorkflowDiagram';
import MetricCard from '../components/MetricCard';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Cpu,
  Database,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const Home = ({ assets = [], comparisonData }) => {
  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>AI-Driven Financial Analytics Platform</span>
          </div>

          <h1 className="hero-headline">
            AI-Powered Stock Price Prediction
          </h1>

          <p className="hero-subtitle">
            Our platform utilizes advanced machine-learning regression models trained on historical market time-series data to evaluate intraday market indicators and estimate future daily closing prices.
          </p>

          <div className="hero-cta-group">
            <Link to="/models" className="btn btn-primary btn-lg">
              <span>Explore All 6 Models</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              <BookOpen size={18} />
              <span>Learn How It Works</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hero-metrics-grid">
            <MetricCard
              label="Available ML Models"
              value="6 Algorithms"
              subtext="Linear, SVR, Trees & Boosting"
              icon={Cpu}
            />
            <MetricCard
              label="Supported Assets"
              value={`${assets.length || 3} Markets`}
              subtext="Reliance, Bitcoin, Google"
              icon={Database}
            />
            <MetricCard
              label="Validation Holdout"
              value="85 / 15 Split"
              subtext="Chronological Time-Series Test"
              icon={ShieldCheck}
            />
            <MetricCard
              label="Data Integration"
              value="Real-Time Sync"
              subtext="Live market prices & custom input"
              icon={TrendingUp}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="home-section">
        <div className="section-header-center">
          <span className="sub-badge">System Process</span>
          <h2 className="section-main-title">How The Platform Works</h2>
          <p className="section-main-desc">
            A transparent four-step pipeline connecting live financial data feeds to statistical ML prediction engines.
          </p>
        </div>

        <div className="how-it-works-grid">
          <div className="hiw-card">
            <div className="hiw-num">01</div>
            <h3 className="hiw-title">Market Data Feed</h3>
            <p className="hiw-desc">
              Connects directly to financial market APIs to retrieve real-time daily Open, High, Low, and Volume records.
            </p>
          </div>
          <div className="hiw-card">
            <div className="hiw-num">02</div>
            <h3 className="hiw-title">Feature Engineering</h3>
            <p className="hiw-desc">
              Standardizes raw features using StandardScaler and generates polynomial interaction terms where required.
            </p>
          </div>
          <div className="hiw-card">
            <div className="hiw-num">03</div>
            <h3 className="hiw-title">Multi-Model Inference</h3>
            <p className="hiw-desc">
              Executes predictions across 6 trained scikit-learn model pipelines simultaneously for comparative analysis.
            </p>
          </div>
          <div className="hiw-card">
            <div className="hiw-num">04</div>
            <h3 className="hiw-title">Analytical Output</h3>
            <p className="hiw-desc">
              Displays predicted close prices, directional dollar & percentage changes, and holdout accuracy metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Available Models Overview Grid */}
      <section className="home-section">
        <div className="section-header-between">
          <div>
            <span className="sub-badge">Algorithm Portfolio</span>
            <h2 className="section-main-title">Available Machine Learning Models</h2>
            <p className="section-main-desc">
              Every model has its own dedicated page for live predictions and technical documentation.
            </p>
          </div>
          <Link to="/models" className="btn btn-outline btn-sm">
            View Comparison Table <ArrowRight size={14} />
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
                currency={comparisonData?.currency}
              />
            );
          })}
        </div>
      </section>

      {/* Market Prediction Workflow */}
      <section className="home-section">
        <WorkflowDiagram title="End-to-End Market Prediction Pipeline" />
      </section>

      {/* Tech Stack */}
      <section className="home-section">
        <div className="section-header-center">
          <span className="sub-badge">Architecture</span>
          <h2 className="section-main-title">Technology Stack</h2>
          <p className="section-main-desc">
            Built using modern, reliable open-source frameworks for high performance and strict quantitative reproducibility.
          </p>
        </div>

        <div className="tech-stack-grid">
          <div className="tech-card">
            <div className="tech-icon-box">React</div>
            <h4>Vite & React 19</h4>
            <p>Component-based user interface rendered with vanilla CSS design system.</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon-box">Python</div>
            <h4>FastAPI Backend</h4>
            <p>High-speed asynchronous Python REST API serving trained model artifacts.</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon-box">Scikit</div>
            <h4>Scikit-Learn ML</h4>
            <p>Standardized pipelines for Linear Regression, SVR, Random Forest, and Gradient Boosting.</p>
          </div>
          <div className="tech-card">
            <div className="tech-icon-box">Charts</div>
            <h4>Recharts Library</h4>
            <p>Interactive data visualization for historical prices and model accuracy benchmarks.</p>
          </div>
        </div>
      </section>

      {/* About Project Summary */}
      <section className="home-section bottom-cta-card">
        <div className="cta-content">
          <h2>Ready to Explore Stock Price Predictions?</h2>
          <p>
            Choose any algorithm to test real-time predictions, analyze custom what-if market scenarios, or read the mathematical specifications.
          </p>
          <div className="cta-buttons">
            <Link to="/models" className="btn btn-primary btn-lg">
              Explore All Models <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              Read Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React from 'react';
import { Link } from '../router/RouterContext';
import { MODELS_LIST } from '../data/modelsData';
import WorkflowDiagram from '../components/WorkflowDiagram';
import {
  BookOpen,
  Cpu,
  Database,
  ShieldAlert,
  BarChart2,
  ArrowRight,
  Code2,
  Server,
  Layers,
  Zap,
  CheckCircle2,
  Activity,
} from 'lucide-react';

const TECH_STACK_ITEMS = [
  {
    category: 'Frontend Suite',
    title: 'React 19 & Vite',
    desc: 'HTML5 client application built with modern hooks, client-side routing, and Vanilla CSS design tokens.',
    icon: Code2,
  },
  {
    category: 'Financial Visuals',
    title: 'Lightweight Charts v5.2',
    desc: 'High-performance TradingView Canvas engine for crosshair line charts, zoom, pan, and real-time legends.',
    icon: Activity,
  },
  {
    category: 'Backend Microservice',
    title: 'Python 3.12 & FastAPI',
    desc: 'High-concurrency RESTful API endpoints powered by Uvicorn, Pydantic data schemas, and CORS security.',
    icon: Server,
  },
  {
    category: 'Quantitative ML',
    title: 'Scikit-Learn & NumPy',
    desc: 'Mathematical regression pipelines, StandardScaler feature normalization, and out-of-sample evaluation metrics.',
    icon: Cpu,
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Historical Market Data Ingestion',
    desc: 'Verified time-series exchange data (Date, Open, High, Low, Close, Volume) is ingested and indexed chronologically.',
  },
  {
    step: '02',
    title: 'Preprocessing & Feature Normalization',
    desc: 'Data is cleansed, missing values handled, and scaled using StandardScaler to equalize feature variance across inputs.',
  },
  {
    step: '03',
    title: 'Multi-Model Regression Training',
    desc: 'Six distinct statistical algorithms (Linear, SVR, Decision Trees, Ensembles) fit parameters on 85% training data.',
  },
  {
    step: '04',
    title: 'Real-Time Price Prediction',
    desc: 'Ingests live intraday quotes to evaluate holdout validation test R² metrics and estimate the next session Close price.',
  },
];

const AboutPage = () => {
  return (
    <div className="about-page-wrapper">
      <div className="about-page-container">
        {/* 1. Hero Section */}
        <section className="about-hero-section">
          <div className="about-hero-content">
            <span className="sub-badge">PLATFORM ARCHITECTURE & METHODOLOGY</span>
            <h1 className="about-hero-title">About QuantAI Stock Predictor</h1>
            <p className="about-hero-desc">
              An interactive quantitative machine learning suite engineered for historical market time-series analysis, multi-model regression training, and real-time stock price forecasting.
            </p>
          </div>
        </section>

        {/* 2. Platform Overview & 2-Column Methodology Section */}
        <section className="about-content-section">
          <div className="section-title-header">
            <BookOpen className="section-title-icon" size={22} />
            <div>
              <h2 className="section-main-title">Machine Learning Methodology</h2>
              <p className="section-subtext">How our platform handles market complexity without single-model bias</p>
            </div>
          </div>

          <div className="about-two-col-grid">
            <div className="about-narrative-card">
              <h3 className="narrative-heading">Addressing Financial Time-Series Complexity</h3>
              <p>
                Financial stock price forecasting is one of the most challenging domain problems in time-series analysis due to market noise, volatility regimes, and unexpected macro-economic events.
              </p>
              <p>
                To address this complexity, our platform avoids single-model dependency by training six distinct statistical and ensemble machine learning algorithms simultaneously on historical market data.
              </p>
              <p>
                By comparing simpler linear estimators against high-dimensional kernel models and decision tree ensembles, users can observe how model complexity affects predictive performance and generalization variance.
              </p>
            </div>

            <div className="about-pillars-stack">
              <div className="pillar-card">
                <div className="pillar-icon-box">
                  <Cpu size={22} className="pillar-icon" />
                </div>
                <div>
                  <h4 className="pillar-title">6 ML Regressors</h4>
                  <p className="pillar-desc">
                    Includes Simple Linear, Multivariate Linear, Polynomial, Support Vector (SVR), Random Forest, and Gradient Boosting.
                  </p>
                </div>
              </div>

              <div className="pillar-card">
                <div className="pillar-icon-box">
                  <Database size={22} className="pillar-icon" />
                </div>
                <div>
                  <h4 className="pillar-title">Real-Time Exchange Sync</h4>
                  <p className="pillar-desc">
                    Ingests live intraday exchange price feeds (Open, High, Low, Volume) from equities and cryptocurrency markets.
                  </p>
                </div>
              </div>

              <div className="pillar-card">
                <div className="pillar-icon-box">
                  <BarChart2 size={22} className="pillar-icon" />
                </div>
                <div>
                  <h4 className="pillar-title">Holdout Validation (85 / 15)</h4>
                  <p className="pillar-desc">
                    Evaluates out-of-sample statistical accuracy using an 85% chronological training split and 15% unseen holdout validation set.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. How It Works Section */}
        <section className="about-content-section">
          <div className="section-title-header">
            <Zap className="section-title-icon" size={22} />
            <div>
              <h2 className="section-main-title">How Our Prediction Pipeline Works</h2>
              <p className="section-subtext">Four clear steps from historical data ingestion to live forecast output</p>
            </div>
          </div>

          <div className="how-it-works-grid-4">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.step} className="hiw-step-card">
                <span className="step-number-badge">{step.step}</span>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Reusable Visual Architecture Pipeline */}
          <div className="workflow-embed-wrapper">
            <WorkflowDiagram title="Global Application Data & Prediction Pipeline" />
          </div>
        </section>

        {/* 4. Technology Stack & ML Models Section */}
        <section className="about-content-section">
          <div className="section-title-header">
            <Layers className="section-title-icon" size={22} />
            <div>
              <h2 className="section-main-title">Technology Stack & Architecture</h2>
              <p className="section-subtext">Production-grade frameworks powering frontend UI, backend API, and ML pipelines</p>
            </div>
          </div>

          {/* Tech Stack 4-Grid */}
          <div className="tech-stack-grid">
            {TECH_STACK_ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.title} className="tech-card">
                  <div className="tech-card-top">
                    <div className="tech-icon-box">
                      <IconComp size={20} />
                    </div>
                    <span className="tech-category-pill">{item.category}</span>
                  </div>
                  <h3 className="tech-card-title">{item.title}</h3>
                  <p className="tech-card-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* 6 ML Models Grid List */}
          <div className="models-overview-block">
            <h3 className="sub-block-title">Implemented Machine Learning Algorithms (6 Regressors)</h3>
            <div className="algo-summary-list">
              {MODELS_LIST.map((m) => (
                <div key={m.key} className="algo-summary-item">
                  <div className="algo-summary-info">
                    <div className="summary-item-header">
                      <h4 className="summary-item-name">{m.name}</h4>
                      <span className="summary-item-category">{m.category}</span>
                    </div>
                    <p className="summary-item-desc">{m.shortDesc}</p>
                    <div className="summary-features">
                      Features: <code>{m.features.join(', ')}</code>
                    </div>
                  </div>
                  <div className="summary-actions">
                    <Link to={`/models/${m.slug}`} className="btn btn-primary btn-sm">
                      Predict
                    </Link>
                    <Link to={`/models/${m.slug}/about`} className="btn btn-secondary btn-sm">
                      About Specs
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Responsible AI & Financial Risk Disclaimer Section */}
        <section className="about-content-section risk-card-section">
          <div className="section-title-header">
            <ShieldAlert className="section-title-icon text-warning" size={24} />
            <div>
              <h2 className="section-main-title">Financial Risk & Responsible AI Disclaimer</h2>
              <p className="section-subtext">Important guidelines for academic and quantitative research use</p>
            </div>
          </div>
          <div className="risk-body-card">
            <p className="risk-lead-text">
              All predictions, price estimates, direction indicators, and validation metrics generated by this platform are created automatically by statistical and machine learning algorithms trained on historical time-series market records.
            </p>
            <div className="risk-highlight-box">
              <CheckCircle2 size={18} className="risk-highlight-icon" />
              <span>
                <strong>Research & Educational Notice:</strong> These outputs are strictly for educational research, quantitative demonstration, and technical analysis purposes. They DO NOT constitute financial advice, trading signals, or guaranteed future market prices.
              </span>
            </div>
            <p className="risk-sub-text">
              Investing in financial markets, equities, and cryptocurrencies involves significant financial risk. Always perform independent research and consult a licensed financial professional before making investment decisions.
            </p>
          </div>
        </section>

        {/* 6. Bottom CTA Banner */}
        <div className="about-cta-banner">
          <div className="cta-banner-content">
            <h2>Explore Our Prediction Engines</h2>
            <p>Compare real-time model predictions or read in-depth algorithm mathematical specifications.</p>
            <div className="cta-btn-group">
              <Link to="/models" className="btn btn-primary btn-lg">
                View All Models Grid <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

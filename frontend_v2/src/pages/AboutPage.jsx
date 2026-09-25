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
  ShieldCheck,
} from 'lucide-react';

const TECH_STACK = [
  {
    category: 'Frontend Suite',
    title: 'React 19 & Vite 6',
    desc: 'HTML5 Single-Page Application client built with modern hooks, custom router, and glassmorphism CSS design tokens.',
    icon: Code2,
  },
  {
    category: 'Financial Canvas',
    title: 'Recharts & Lightweight Charts',
    desc: 'High-performance TradingView Canvas engine for crosshair line charts, zoom, pan, and holdout accuracy visuals.',
    icon: Activity,
  },
  {
    category: 'Backend Microservice',
    title: 'Python 3.12 & FastAPI',
    desc: 'High-concurrency RESTful API endpoints powered by Uvicorn, Pydantic schemas, and CORS security.',
    icon: Server,
  },
  {
    category: 'Quantitative ML',
    title: 'Scikit-Learn & NumPy',
    desc: 'Mathematical regression pipelines, StandardScaler feature normalization, and out-of-sample evaluation metrics.',
    icon: Cpu,
  },
];

const AboutPage = () => {
  return (
    <div className="container-xl" style={{ paddingTop: '2.5rem' }}>
      {/* 1. Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="sub-badge">SYSTEM ARCHITECTURE & METHODOLOGY</span>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
          About QuantAI Stock Predictor v2.0
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '750px', margin: '0.75rem auto 0 auto', lineHeight: '1.6' }}>
          An interactive quantitative machine learning suite engineered for historical market time-series analysis, multi-model regression training, and real-time stock price forecasting.
        </p>
      </section>

      {/* 2. Platform Overview & 2-Column Methodology */}
      <section className="section-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <BookOpen size={22} style={{ color: 'var(--neon-cyan)' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Machine Learning Methodology</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--neon-cyan)' }}>
              Addressing Financial Time-Series Complexity
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
              Financial stock price forecasting is one of the most challenging domain problems in time-series analysis due to market noise, volatility regimes, and unexpected macro-economic events.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
              To address this complexity, our platform avoids single-model dependency by training six distinct statistical and ensemble machine learning algorithms simultaneously on historical market data.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              By comparing simpler linear estimators against high-dimensional kernel models and decision tree ensembles, users can observe how model complexity affects predictive performance and generalization variance.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '0.6rem', borderRadius: 'var(--radius-md)', color: 'var(--neon-cyan)' }}>
                <Cpu size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>6 ML Regressors</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Includes Simple Linear, Multivariate Linear, Polynomial, Support Vector (SVR), Random Forest, and Gradient Boosting.
                </p>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '0.6rem', borderRadius: 'var(--radius-md)', color: 'var(--neon-purple)' }}>
                <Database size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Real-Time Exchange Sync</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Ingests live intraday exchange price feeds (Open, High, Low, Volume) from equities and cryptocurrency markets.
                </p>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem', borderRadius: 'var(--radius-md)', color: 'var(--neon-emerald)' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Holdout Validation (85 / 15)</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Evaluates out-of-sample statistical accuracy using an 85% chronological training split and 15% unseen holdout test set.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Global Pipeline Visual */}
      <section className="section-wrapper">
        <WorkflowDiagram title="Global Application Data & Prediction Pipeline" />
      </section>

      {/* 4. Technology Stack & Regressors List */}
      <section className="section-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <Layers size={22} style={{ color: 'var(--neon-cyan)' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Technology Stack & Architecture</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {TECH_STACK.map((item) => {
            const IconComp = item.icon;
            return (
              <div key={item.title} className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--neon-cyan)' }}>
                    <IconComp size={18} />
                  </div>
                  <span className="sub-badge" style={{ fontSize: '0.7rem' }}>{item.category}</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* 6 ML Models List */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Implemented Machine Learning Regressors (6 Models)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {MODELS_LIST.map((m) => (
              <div key={m.key} style={{ background: 'rgba(5, 9, 18, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</h4>
                    <span className="sub-badge" style={{ fontSize: '0.7rem' }}>{m.category}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{m.shortDesc}</p>
                  <div className="mono-font" style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', marginTop: '0.4rem' }}>
                    Features: <code>{m.features.join(', ')}</code>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/models/${m.slug}`} className="btn btn-primary btn-sm">
                    Predict Live
                  </Link>
                  <Link to={`/models/${m.slug}/about`} className="btn btn-secondary btn-sm">
                    Math Specs
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Responsible AI & Financial Risk Disclaimer */}
      <section className="section-wrapper" style={{ marginBottom: '3rem' }}>
        <div className="glass-card" style={{ border: '1px solid rgba(245, 158, 11, 0.4)', background: 'radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.7) 80%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: 'var(--neon-amber)' }}>
            <ShieldAlert size={24} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Financial Risk & Responsible AI Disclaimer</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '1rem' }}>
            All predictions, price estimates, direction indicators, and validation metrics generated by this platform are created automatically by statistical and machine learning algorithms trained on historical time-series market records.
          </p>
          <div style={{ background: 'rgba(245, 158, 11, 0.12)', borderLeft: '4px solid var(--neon-amber)', padding: '1rem 1.25rem', borderRadius: '0 var(--radius-md) var(--radius-md) 0', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <CheckCircle2 size={20} style={{ color: 'var(--neon-amber)', marginTop: 2 }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              <strong>Research & Educational Notice:</strong> These outputs are strictly for educational research, quantitative demonstration, and technical analysis purposes. They DO NOT constitute financial advice, trading signals, or guaranteed future market prices.
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Investing in financial markets, equities, and cryptocurrencies involves significant financial risk. Always perform independent research and consult a licensed financial professional before making investment decisions.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

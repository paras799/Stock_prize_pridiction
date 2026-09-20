import { useEffect, useState } from 'react';
import { Scale, Award, Activity, Zap, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import ComparisonChart from '../components/charts/ComparisonChart';
import { fetchComparisonMetrics } from '../services/api';

const ComparisonPage = ({ onSelectModel }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComparisonMetrics()
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load model comparison.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem auto' }} color="var(--primary)" />
        <p>Loading multi-model comparative performance benchmark...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="comparison-page animate-fade-in">
      <section className="about-hero glass-panel">
        <div className="hero-content">
          <div className="hero-badge">
            <Scale size={16} color="var(--primary)" />
            <span>Multi-Model Performance Suite Benchmark</span>
          </div>
          <h1>Model Accuracy <span>Comparison Matrix</span></h1>
          <p className="hero-desc">
            Compare all 4 stock prediction regression algorithms (SVR, Simple Linear, Multiple Linear, & Polynomial) trained on identical stock market data splits.
          </p>

          {metrics?.best_model && (
            <div className="best-model-banner glass-panel highlight-border" style={{ marginTop: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Award size={24} color="#10b981" />
              <div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Highest Accuracy Model Winner:</span>
                <h3 style={{ margin: 0, color: '#10b981' }}>{metrics.best_model}</h3>
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <ComparisonChart comparisonMetrics={metrics} />
      </section>

      <section className="specs-section glass-panel" style={{ marginTop: '2rem' }}>
        <div className="section-title">
          <Zap size={24} color="var(--primary)" />
          <h2>Side-by-Side Model Benchmark Table</h2>
        </div>

        <div className="specs-table-wrapper">
          <table className="specs-table">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Features Used</th>
                <th>R² Accuracy (%)</th>
                <th>MAE ($ Error)</th>
                <th>RMSE ($ Error)</th>
                <th>MAPE (%)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.models?.map((m, idx) => (
                <tr key={idx} className={m.model_name === metrics.best_model ? 'highlight-row' : ''}>
                  <td>
                    <strong>{m.model_name}</strong>
                    {m.model_name === metrics.best_model && (
                      <span className="best-badge" style={{ marginLeft: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                        ★ Best
                      </span>
                    )}
                  </td>
                  <td>{m.features_used.join(', ')}</td>
                  <td><strong style={{ color: '#10b981' }}>{m.r2_test_percentage}%</strong></td>
                  <td>${m.mae}</td>
                  <td>${m.rmse}</td>
                  <td>{m.mape}%</td>
                  <td>
                    <button
                      className="table-action-btn"
                      onClick={() => onSelectModel(m.model_key)}
                      style={{ padding: '4px 12px', borderRadius: '6px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                    >
                      <span>Open Model</span>
                      <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ComparisonPage;

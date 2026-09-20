import { useState, useEffect } from 'react';
import {
  Award,
  Activity,
  Layers,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Zap,
  Database,
  Sliders,
  Cpu,
  Calculator,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { predictSVR } from '../../services/api';

const SvrAbout = ({ metrics }) => {
  const [simOpenPrice, setSimOpenPrice] = useState('100.00');
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState('');

  useEffect(() => {
    const rawVal = parseFloat(simOpenPrice);
    if (isNaN(rawVal) || rawVal <= 0) {
      setSimResult(null);
      setSimError('Please enter a valid positive opening price.');
      return;
    }

    setSimLoading(true);
    setSimError('');

    const controller = new AbortController();
    predictSVR(rawVal)
      .then((data) => {
        setSimResult(data);
        setSimLoading(false);
      })
      .catch(() => {
        setSimError('Unable to fetch calculation from backend SVR API.');
        setSimLoading(false);
      });

    return () => controller.abort();
  }, [simOpenPrice]);

  const metricsData = metrics && metrics.status === 'success' ? metrics : null;

  return (
    <div className="about-detail-container animate-fade-in">
      {/* Hero Header */}
      <section className="about-hero glass-panel">
        <div className="hero-content">
          <div className="hero-badge">
            <Sliders size={16} color="var(--primary)" />
            <span>Support Vector Regression Architecture</span>
          </div>
          <h1>Support Vector <span>Regression (SVR)</span></h1>
          <p className="hero-desc">
            SVR projects stock price market signals into higher-dimensional feature space using an <strong>RBF Kernel</strong> and fits an ε-insensitive tube to predict continuous stock <code>Close</code> prices.
          </p>
          <div className="hero-tags">
            <span className="tag"><CheckCircle2 size={14} /> Holdout Method (80/20 Split)</span>
            <span className="tag"><CheckCircle2 size={14} /> RBF Kernel</span>
            <span className="tag highlight"><Award size={14} /> {metricsData ? `${metricsData.r2_test_percentage}% Test R² Accuracy` : 'Loading...'}</span>
            <span className="tag"><Activity size={14} /> MAE: {metricsData ? `$${metricsData.mae}` : 'Loading...'}</span>
          </div>
        </div>
      </section>

      {/* Model Training & Method Specifications Card */}
      <section className="specs-section glass-panel">
        <div className="section-title">
          <Database size={24} color="var(--primary)" />
          <h2>SVR Model Training Methodology & Hyperparameters</h2>
        </div>

        <div className="specs-table-wrapper">
          <table className="specs-table">
            <tbody>
              <tr>
                <td><strong>Validation Method</strong></td>
                <td><span className="tag highlight"><CheckCircle2 size={14} /> Holdout Method</span> (80% Train / 20% Unseen Test Split)</td>
              </tr>
              <tr>
                <td><strong>Training Algorithm</strong></td>
                <td>Support Vector Regression Optimization with ε-Insensitive Loss Tube</td>
              </tr>
              <tr>
                <td><strong>Hyperparameters Tuned</strong></td>
                <td><code>kernel='rbf'</code>, <code>C=100.0</code>, <code>gamma=0.1</code>, <code>epsilon=0.1</code></td>
              </tr>
              <tr>
                <td><strong>Preprocessing Transformer</strong></td>
                <td><code>StandardScaler()</code> (Z-score Normalization: z = (x - μ) / σ)</td>
              </tr>
              <tr>
                <td><strong>Primary Accuracy Metric</strong></td>
                <td>R² Score (Coefficient of Determination) = <strong>{metricsData ? `${metricsData.r2_test_percentage}%` : 'Loading...'}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="metrics-section" style={{ marginTop: '2rem' }}>
        <div className="section-title">
          <BarChart3 size={24} color="var(--primary)" />
          <h2>SVR Model Performance Metrics</h2>
        </div>
        {metricsData ? (
          <div className="metrics-grid">
            <div className="metric-card glass-panel highlight-border">
              <span className="metric-title">R² Accuracy Score</span>
              <div className="metric-value text-gradient">{metricsData.r2_test_percentage}%</div>
              <p className="metric-subtext">On unseen test dataset split</p>
            </div>
            <div className="metric-card glass-panel">
              <span className="metric-title">Mean Absolute Error (MAE)</span>
              <div className="metric-value">${metricsData.mae}</div>
              <p className="metric-subtext">Average dollar deviation</p>
            </div>
            <div className="metric-card glass-panel">
              <span className="metric-title">Root Mean Sq. Error (RMSE)</span>
              <div className="metric-value">${metricsData.rmse}</div>
              <p className="metric-subtext">Residual standard deviation</p>
            </div>
            <div className="metric-card glass-panel">
              <span className="metric-title">Relative Error (MAPE)</span>
              <div className="metric-value">{metricsData.mape}%</div>
              <p className="metric-subtext">Percentage variation</p>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 1rem auto' }} />
            <p>Fetching SVR metrics from backend...</p>
          </div>
        )}
      </section>

      {/* Math Formula Pipeline */}
      <section className="pipeline-section glass-panel">
        <div className="section-title">
          <Layers size={24} color="var(--primary)" />
          <h2>Mathematical Formulation & Execution Steps</h2>
        </div>
        <div className="pipeline-steps">
          <div className="pipeline-step">
            <div className="step-header">
              <div className="step-icon-wrapper"><Database size={20} color="var(--primary)" /></div>
              <span className="step-badge">1. Normalization</span>
            </div>
            <div className="step-body">
              <p>Scales input feature Open using StandardScaler transform to zero mean (μ) and unit variance (σ).</p>
            </div>
            <div className="code-formula">
              z = (Open - μ) / σ
            </div>
          </div>

          <div className="pipeline-step">
            <div className="step-header">
              <div className="step-icon-wrapper"><Cpu size={20} color="var(--primary)" /></div>
              <span className="step-badge">2. RBF Kernel</span>
            </div>
            <div className="step-body">
              <p>Projects normalized data into Hilbert feature space with Radial Basis Function kernel.</p>
            </div>
            <div className="code-formula">
              K(x, x') = exp(-γ · ||x - x'||²)
            </div>
          </div>

          <div className="pipeline-step">
            <div className="step-header">
              <div className="step-icon-wrapper"><Zap size={20} color="var(--primary)" /></div>
              <span className="step-badge">3. Insensitive Tube</span>
            </div>
            <div className="step-body">
              <p>Optimizes loss within an ε-margin, ignoring small errors while penalizing deviations outside margin with penalty factor C.</p>
            </div>
            <div className="code-formula">
              Params: C = 100.0, ε = 0.1, γ = 0.1
            </div>
          </div>
        </div>
      </section>

      {/* Simulator */}
      <section className="simulation-section glass-panel">
        <div className="section-title">
          <Calculator size={24} color="var(--primary)" />
          <h2>Live Backend SVR Inference Simulator</h2>
        </div>
        <div className="sim-grid">
          <div className="sim-control">
            <label htmlFor="sim-input-svr">Input Opening Price ($):</label>
            <div className="sim-input-wrapper">
              <input
                id="sim-input-svr"
                type="number"
                step="0.01"
                value={simOpenPrice}
                onChange={(e) => setSimOpenPrice(e.target.value)}
              />
            </div>
            <div className="quick-presets">
              <span>Quick Presets:</span>
              <button onClick={() => setSimOpenPrice('15.50')}>$15.50</button>
              <button onClick={() => setSimOpenPrice('100.00')}>$100.00</button>
              <button onClick={() => setSimOpenPrice('250.00')}>$250.00</button>
            </div>
          </div>

          <div className="sim-flow">
            {simLoading ? (
              <div className="sim-loading-state">
                <Loader2 className="animate-spin" size={24} color="var(--primary)" />
                <span>Running SVR inference on backend...</span>
              </div>
            ) : simResult ? (
              <div className="sim-steps">
                <div className="sim-step-box">
                  <span className="sim-step-tag">Input Raw</span>
                  <div className="sim-step-val">${simResult.open_price.toFixed(2)}</div>
                </div>
                <div className="sim-arrow"><ArrowRight size={18} /></div>
                <div className="sim-step-box">
                  <span className="sim-step-tag">Z-Score Scaled</span>
                  <div className="sim-step-val">Z = {simResult.details?.scaled_open}</div>
                </div>
                <div className="sim-arrow"><ArrowRight size={18} /></div>
                <div className="sim-step-box highlight-box">
                  <span className="sim-step-tag">SVR Predicted Close</span>
                  <div className="sim-step-val">${simResult.predicted_close.toFixed(2)}</div>
                </div>
              </div>
            ) : (
              <p className="error-text">{simError}</p>
            )}
          </div>
        </div>
      </section>

      {/* Ground Truth Chart */}
      {metricsData && metricsData.comparison_samples && (
        <section className="chart-section glass-panel">
          <div className="section-title">
            <TrendingUp size={24} color="var(--primary)" />
            <h2>Actual Close vs. SVR Predicted Close (Test Samples)</h2>
          </div>
          <div className="chart-wrapper" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricsData.comparison_samples}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px' }} />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="actualClose" name="Actual Close ($)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="predictedClose" name="SVR Predicted Close ($)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
};

export default SvrAbout;

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
  SlidersHorizontal,
  BrainCircuit,
  Calculator,
  ShieldAlert,
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

const AboutPage = ({ metrics }) => {
  const [simOpenPrice, setSimOpenPrice] = useState('100.00');
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState('');

  // Fetch live model calculation and SVR prediction directly from backend API
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
    fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Open: rawVal }),
      signal: controller.signal
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Backend prediction API error.');
        }
        return res.json();
      })
      .then((data) => {
        setSimResult(data);
        setSimLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setSimError('Unable to fetch calculation from backend SVR model.');
          setSimLoading(false);
        }
      });

    return () => controller.abort();
  }, [simOpenPrice]);

  const metricsData = metrics && metrics.status === 'success' ? metrics : null;

  return (
    <div className="about-page animate-fade-in">
      {/* Hero Header */}
      <section className="about-hero glass-panel">
        <div className="hero-content">
          <div className="hero-badge">
            <BrainCircuit size={16} color="var(--primary)" />
            <span>Support Vector Regression Architecture</span>
          </div>
          <h1>Understanding StockX <span>Model & Accuracy</span></h1>
          <p className="hero-desc">
            StockX Predictor utilizes a trained <strong>Support Vector Regressor (SVR)</strong> paired with
            an automated <strong>StandardScaler pipeline</strong> to forecast daily stock <code>Close</code> prices
            directly from opening market signals.
          </p>
          <div className="hero-tags">
            <span className="tag">
              <CheckCircle2 size={14} /> {metricsData ? `${metricsData.hyperparameters.kernel.toUpperCase()} Kernel` : 'RBF Kernel'}
            </span>
            <span className="tag">
              <CheckCircle2 size={14} /> {metricsData ? `${metricsData.dataset.total_records.toLocaleString()} Historical Samples` : 'Loading Samples...'}
            </span>
            <span className="tag highlight">
              <Award size={14} /> {metricsData ? `${metricsData.r2_test_percentage}% Test Accuracy (R²)` : 'Loading Accuracy...'}
            </span>
            <span className="tag">
              <CheckCircle2 size={14} /> MAE: {metricsData ? `$${metricsData.mae}` : 'Loading MAE...'}
            </span>
          </div>
        </div>
      </section>

      {/* Accuracy & Key Metrics Grid */}
      <section className="metrics-section">
        <div className="section-title">
          <BarChart3 size={24} color="var(--primary)" />
          <h2>Model Accuracy & Performance Metrics</h2>
        </div>

        {metricsData ? (
          <div className="metrics-grid">
            <div className="metric-card glass-panel highlight-border">
              <div className="metric-header">
                <span className="metric-title">R² Accuracy Score</span>
                <Award className="metric-icon" size={20} color="#10b981" />
              </div>
              <div className="metric-value text-gradient">{metricsData.r2_test_percentage}%</div>
              <p className="metric-subtext">Calculated on 20% independent test split ({metricsData.dataset.test_records} unseen samples)</p>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, metricsData.r2_test_percentage))}%` }}></div>
              </div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-header">
                <span className="metric-title">Mean Absolute Error (MAE)</span>
                <Activity className="metric-icon" size={20} color="#3b82f6" />
              </div>
              <div className="metric-value">${metricsData.mae}</div>
              <p className="metric-subtext">Average absolute deviation between predicted & actual close prices</p>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-header">
                <span className="metric-title">Root Mean Sq. Error (RMSE)</span>
                <Zap className="metric-icon" size={20} color="#8b5cf6" />
              </div>
              <div className="metric-value">${metricsData.rmse}</div>
              <p className="metric-subtext">Standard deviation of prediction residuals (penalizes larger errors)</p>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-header">
                <span className="metric-title">Mean Rel. Error (MAPE)</span>
                <TrendingUp className="metric-icon" size={20} color="#f59e0b" />
              </div>
              <div className="metric-value">{metricsData.mape}%</div>
              <p className="metric-subtext">Percentage variation relative to ground truth stock closing prices</p>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 1rem auto' }} />
            <p>Fetching model metrics directly from backend server...</p>
          </div>
        )}
      </section>

      {/* Training Workflow Pipeline */}
      {metricsData && (
        <section className="pipeline-section glass-panel">
          <div className="section-title">
            <Layers size={24} color="var(--primary)" />
            <h2>How the Model Was Trained</h2>
          </div>
          <p className="section-subtitle">
            The machine learning pipeline follows a disciplined 4-stage cross-validated training protocol built with Scikit-Learn.
          </p>

          <div className="pipeline-steps">
            <div className="pipeline-step">
              <div className="step-header">
                <div className="step-icon-wrapper">
                  <Database size={20} color="var(--primary)" />
                </div>
                <span className="step-badge">Step 01</span>
              </div>
              <div className="step-body">
                <h3>Dataset Ingestion & Split</h3>
                <p>
                  Loaded <strong>{metricsData.dataset.total_records.toLocaleString()}</strong> historical daily records
                  (<strong>{metricsData.dataset.start_date}</strong> to <strong>{metricsData.dataset.end_date}</strong>).
                  Divided into 80% Train ({metricsData.dataset.train_records} rows) and 20% Test ({metricsData.dataset.test_records} rows) splits.
                </p>
              </div>
              <div className="code-formula">
                Split: {metricsData.dataset.split_ratio} (Seed: 42)
              </div>
            </div>

            <div className="pipeline-step">
              <div className="step-header">
                <div className="step-icon-wrapper">
                  <Sliders size={20} color="var(--primary)" />
                </div>
                <span className="step-badge">Step 02</span>
              </div>
              <div className="step-body">
                <h3>StandardScaler Normalization</h3>
                <p>
                  Stock features exhibit varying scales. Standardization converts opening prices to zero mean (μ) and unit variance (σ) for numerical stability.
                </p>
              </div>
              <div className="code-formula">
                z = (Open - μ) / σ &nbsp;|&nbsp; μ = {metricsData.hyperparameters.scaler_mean}, σ = {metricsData.hyperparameters.scaler_scale}
              </div>
            </div>

            <div className="pipeline-step">
              <div className="step-header">
                <div className="step-icon-wrapper">
                  <Cpu size={20} color="var(--primary)" />
                </div>
                <span className="step-badge">Step 03</span>
              </div>
              <div className="step-body">
                <h3>SVR Fitting with RBF Kernel</h3>
                <p>
                  Support Vector Regression projects non-linear relationships into higher-dimensional feature space via a Radial Basis Function (RBF) kernel.
                </p>
              </div>
              <div className="code-formula">
                K(x, x') = exp(-γ · ||x - x'||²) &nbsp;|&nbsp; γ = {metricsData.hyperparameters.gamma}
              </div>
            </div>

            <div className="pipeline-step">
              <div className="step-header">
                <div className="step-icon-wrapper">
                  <SlidersHorizontal size={20} color="var(--primary)" />
                </div>
                <span className="step-badge">Step 04</span>
              </div>
              <div className="step-body">
                <h3>Hyperparameter & Margin Optimization</h3>
                <p>
                  Optimizes an ε-insensitive loss tube where small deviations within margin ε are ignored, controlled by soft margin constant C.
                </p>
              </div>
              <div className="code-formula">
                Params: C = {metricsData.hyperparameters.C} &nbsp;|&nbsp; ε = {metricsData.hyperparameters.epsilon}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Prediction Step Simulator - Powered by Backend API */}
      <section className="simulation-section glass-panel">
        <div className="section-title">
          <Calculator size={24} color="var(--primary)" />
          <h2>Backend SVR Model Step-by-Step Execution</h2>
        </div>
        <p className="section-subtitle">
          Test the backend prediction pipeline in real-time. Input values are processed directly by the trained SVR model (<code style={{ color: 'var(--primary)' }}>svr_model.pkl</code>) via backend REST API.
        </p>

        <div className="sim-grid">
          <div className="sim-control">
            <label htmlFor="sim-input">Input Opening Price ($):</label>
            <div className="sim-input-wrapper">
              <input
                id="sim-input"
                type="number"
                step="0.01"
                value={simOpenPrice}
                onChange={(e) => setSimOpenPrice(e.target.value)}
                placeholder="e.g. 100.00"
              />
            </div>
            <div className="quick-presets">
              <span>Quick Presets:</span>
              <button onClick={() => setSimOpenPrice('15.50')}>$15.50</button>
              <button onClick={() => setSimOpenPrice('50.00')}>$50.00</button>
              <button onClick={() => setSimOpenPrice('143.50')}>$143.50</button>
              <button onClick={() => setSimOpenPrice('250.00')}>$250.00</button>
            </div>
          </div>

          <div className="sim-flow">
            {simLoading ? (
              <div className="sim-loading-state">
                <Loader2 className="animate-spin" size={24} color="var(--primary)" />
                <span>Running SVR model inference on backend server...</span>
              </div>
            ) : simError ? (
              <p className="error-text">{simError}</p>
            ) : simResult ? (
              <div className="sim-steps">
                <div className="sim-step-box">
                  <span className="sim-step-tag">Step 1: Input Raw Value</span>
                  <div className="sim-step-val">${simResult.open_price.toFixed(2)}</div>
                  <span className="sim-step-sub">Raw Market Signal</span>
                </div>

                <div className="sim-arrow"><ArrowRight size={18} /></div>

                <div className="sim-step-box">
                  <span className="sim-step-tag">Step 2: Backend Scaler Z-Score</span>
                  <div className="sim-step-val">Z = {simResult.scaled_open}</div>
                  <span className="sim-step-sub">
                    ({simResult.open_price} - {simResult.scaler_mean}) / {simResult.scaler_scale}
                  </span>
                </div>

                <div className="sim-arrow"><ArrowRight size={18} /></div>

                <div className="sim-step-box highlight-box">
                  <span className="sim-step-tag">Step 3: Backend SVR Model Prediction</span>
                  <div className="sim-step-val">${simResult.predicted_close.toFixed(2)}</div>
                  <span className="sim-step-sub">
                    Expected Delta: {simResult.price_change >= 0 ? `+${simResult.price_change.toFixed(2)}` : simResult.price_change.toFixed(2)} ({simResult.percentage_change >= 0 ? `+${simResult.percentage_change.toFixed(2)}` : simResult.percentage_change.toFixed(2)}%)
                  </span>
                </div>
              </div>
            ) : (
              <p className="error-text">Enter a valid positive number to compute model prediction via API.</p>
            )}
          </div>
        </div>
      </section>

      {/* Ground Truth vs Prediction Visual Comparison Chart */}
      {metricsData && metricsData.comparison_samples && metricsData.comparison_samples.length > 0 && (
        <section className="chart-section glass-panel">
          <div className="section-title">
            <TrendingUp size={24} color="var(--primary)" />
            <h2>Actual Close vs. SVR Predicted Close (Test Samples)</h2>
          </div>
          <p className="section-subtitle">
            Visual evaluation comparing actual market closing prices against SVR model predictions across test evaluation records.
          </p>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={metricsData.comparison_samples} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="actualClose" name="Actual Close ($)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} />
                <Area type="monotone" dataKey="predictedClose" name="Predicted Close ($)" stroke="#10b981" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Dataset & Specs Summary */}
      {metricsData && (
        <section className="specs-section glass-panel">
          <div className="section-title">
            <Database size={24} color="var(--primary)" />
            <h2>Dataset & Model Specifications Summary</h2>
          </div>

          <div className="specs-table-wrapper">
            <table className="specs-table">
              <tbody>
                <tr>
                  <td><strong>Model Architecture</strong></td>
                  <td>Support Vector Regression (SVR) + StandardScaler Pipeline</td>
                </tr>
                <tr>
                  <td><strong>Target Feature</strong></td>
                  <td><code>Close</code> Price (Continuous Numerical Output)</td>
                </tr>
                <tr>
                  <td><strong>Input Features</strong></td>
                  <td><code>Open</code> Opening Market Price</td>
                </tr>
                <tr>
                  <td><strong>Total Dataset Size</strong></td>
                  <td>{metricsData.dataset.total_records.toLocaleString()} Daily Stock Records</td>
                </tr>
                <tr>
                  <td><strong>Training / Testing Split</strong></td>
                  <td>{metricsData.dataset.split_ratio} ({metricsData.dataset.train_records} Train / {metricsData.dataset.test_records} Test)</td>
                </tr>
                <tr>
                  <td><strong>Stock Price Range</strong></td>
                  <td>${metricsData.dataset.open_range[0]} – ${metricsData.dataset.open_range[1]} (Opening) | ${metricsData.dataset.close_range[0]} – ${metricsData.dataset.close_range[1]} (Closing)</td>
                </tr>
                <tr>
                  <td><strong>RBF Kernel Parameters</strong></td>
                  <td>Kernel = <code>{metricsData.hyperparameters.kernel}</code>, C = {metricsData.hyperparameters.C}, ε = {metricsData.hyperparameters.epsilon}, γ = {metricsData.hyperparameters.gamma}</td>
                </tr>
                <tr>
                  <td><strong>Primary Evaluation Metric</strong></td>
                  <td>R² Coefficient of Determination = <strong>{metricsData.r2_test_percentage}%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="disclaimer-note">
            <ShieldAlert size={18} color="#f59e0b" />
            <span>
              <strong>Educational & Analytical Notice:</strong> Financial market stock prices are influenced by broader macroeconomic events and liquidity shifts. SVR models provide statistical predictions based on historical opening relationships and should be combined with risk management.
            </span>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;

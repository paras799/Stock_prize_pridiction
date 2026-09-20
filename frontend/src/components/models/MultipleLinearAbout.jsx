import { useState, useEffect } from 'react';
import {
  Award,
  Activity,
  Layers,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Database,
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
import { predictMultipleLinear } from '../../services/api';

const MultipleLinearAbout = ({ metrics }) => {
  const [openVal, setOpenVal] = useState('100.00');
  const [highVal, setHighVal] = useState('102.50');
  const [lowVal, setLowVal] = useState('99.10');
  const [volVal, setVolVal] = useState('1200000');
  
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState('');

  useEffect(() => {
    const o = parseFloat(openVal);
    const h = parseFloat(highVal);
    const l = parseFloat(lowVal);
    const v = parseFloat(volVal || 0);

    if (isNaN(o) || isNaN(h) || isNaN(l) || o <= 0) {
      setSimResult(null);
      setSimError('Please enter valid numeric indicators.');
      return;
    }

    setSimLoading(true);
    setSimError('');

    const controller = new AbortController();
    predictMultipleLinear(o, h, l, v)
      .then((data) => {
        setSimResult(data);
        setSimLoading(false);
      })
      .catch(() => {
        setSimError('Unable to fetch calculation from backend Multiple Linear API.');
        setSimLoading(false);
      });

    return () => controller.abort();
  }, [openVal, highVal, lowVal, volVal]);

  const metricsData = metrics && metrics.status === 'success' ? metrics : null;

  return (
    <div className="about-detail-container animate-fade-in">
      {/* Hero Header */}
      <section className="about-hero glass-panel">
        <div className="hero-content">
          <div className="hero-badge">
            <BarChart3 size={16} color="var(--primary)" />
            <span>Multiple Linear Regression Architecture</span>
          </div>
          <h1>Multiple Linear <span>Regression</span></h1>
          <p className="hero-desc">
            Multiple Linear Regression combines 4 market signals: <code>Open</code>, <code>High</code>, <code>Low</code>, and <code>Volume</code> to predict the stock closing price with highest multi-variate accuracy.
          </p>
          <div className="hero-tags">
            <span className="tag"><CheckCircle2 size={14} /> Holdout Method (80/20 Split)</span>
            <span className="tag"><CheckCircle2 size={14} /> 4 Feature Inputs</span>
            <span className="tag highlight"><Award size={14} /> {metricsData ? `${metricsData.r2_test_percentage}% Test R² Accuracy` : 'Loading...'}</span>
            <span className="tag"><Activity size={14} /> MAE: {metricsData ? `$${metricsData.mae}` : 'Loading...'}</span>
          </div>
        </div>
      </section>

      {/* Model Training & Method Specifications Card */}
      <section className="specs-section glass-panel">
        <div className="section-title">
          <Database size={24} color="var(--primary)" />
          <h2>Multiple Linear Model Training Methodology & Hyperparameters</h2>
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
                <td>Multivariate Ordinary Least Squares (OLS) minimizing ∑ (y_i - ŷ_i)²</td>
              </tr>
              <tr>
                <td><strong>Hyperparameters Tuned</strong></td>
                <td>Features: <code>Open</code>, <code>High</code>, <code>Low</code>, <code>Volume</code> (Intercept β₀ + 4 coefficients)</td>
              </tr>
              <tr>
                <td><strong>Preprocessing Transformer</strong></td>
                <td>Multivariate Feature Array Selection & Null Imputation</td>
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
          <h2>Multiple Linear Performance Metrics</h2>
        </div>
        {metricsData ? (
          <div className="metrics-grid">
            <div className="metric-card glass-panel highlight-border">
              <span className="metric-title">R² Accuracy Score</span>
              <div className="metric-value text-gradient">{metricsData.r2_test_percentage}%</div>
              <p className="metric-subtext">Highest accuracy score among all models!</p>
            </div>
            <div className="metric-card glass-panel">
              <span className="metric-title">Mean Absolute Error (MAE)</span>
              <div className="metric-value">${metricsData.mae}</div>
              <p className="metric-subtext">Lowest error margin ($0.50 deviation)</p>
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
            <p>Fetching metrics from backend...</p>
          </div>
        )}
      </section>

      {/* Math Formula Pipeline */}
      <section className="pipeline-section glass-panel">
        <div className="section-title">
          <Layers size={24} color="var(--primary)" />
          <h2>Multivariate Linear Equation</h2>
        </div>
        <div className="pipeline-steps">
          <div className="pipeline-step">
            <div className="step-header">
              <div className="step-icon-wrapper"><Database size={20} color="var(--primary)" /></div>
              <span className="step-badge">Multivariate Equation</span>
            </div>
            <div className="step-body">
              <p>Predicts target Close using linear combinations of Open, High, Low, and Volume.</p>
            </div>
            <div className="code-formula">
              Close = β₀ + β₁ · Open + β₂ · High + β₃ · Low + β₄ · Volume
            </div>
          </div>

          <div className="pipeline-step">
            <div className="step-header">
              <div className="step-icon-wrapper"><Award size={20} color="var(--primary)" /></div>
              <span className="step-badge">Fitted Parameters</span>
            </div>
            <div className="step-body">
              <p>Fitted feature coefficients learned from training split:</p>
            </div>
            <div className="code-formula">
              {metricsData?.hyperparameters?.formula || 'Close = b1*Open + b2*High + b3*Low + b4*Vol + c'}
            </div>
          </div>
        </div>
      </section>

      {/* Simulator */}
      <section className="simulation-section glass-panel">
        <div className="section-title">
          <Calculator size={24} color="var(--primary)" />
          <h2>Live Multiple Linear Inference Simulator</h2>
        </div>
        <div className="sim-grid">
          <div className="sim-control">
            <div className="multi-sim-inputs">
              <div>
                <label>Open ($):</label>
                <input type="number" value={openVal} onChange={(e) => setOpenVal(e.target.value)} />
              </div>
              <div>
                <label>High ($):</label>
                <input type="number" value={highVal} onChange={(e) => setHighVal(e.target.value)} />
              </div>
              <div>
                <label>Low ($):</label>
                <input type="number" value={lowVal} onChange={(e) => setLowVal(e.target.value)} />
              </div>
              <div>
                <label>Volume:</label>
                <input type="number" value={volVal} onChange={(e) => setVolVal(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="sim-flow">
            {simLoading ? (
              <div className="sim-loading-state">
                <Loader2 className="animate-spin" size={24} color="var(--primary)" />
                <span>Running Multiple Linear inference on backend...</span>
              </div>
            ) : simResult ? (
              <div className="sim-steps">
                <div className="sim-step-box">
                  <span className="sim-step-tag">4 Input Signals</span>
                  <div className="sim-step-val">O:${simResult.open_price} | H:${simResult.high_price}</div>
                </div>
                <div className="sim-arrow"><ArrowRight size={18} /></div>
                <div className="sim-step-box highlight-box">
                  <span className="sim-step-tag">Multiple Linear Predicted Close</span>
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
            <h2>Actual Close vs. Multiple Linear Predicted Close (Test Samples)</h2>
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
                <Area type="monotone" dataKey="predictedClose" name="Multiple Linear Predicted ($)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
};

export default MultipleLinearAbout;

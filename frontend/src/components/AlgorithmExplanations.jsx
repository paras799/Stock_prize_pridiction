import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Code2, CheckCircle2, AlertTriangle } from 'lucide-react';

const ALGORITHMS_DOCS = [
  {
    key: 'linear',
    name: 'Simple Linear Regression',
    formula: 'Close = b₀ + b₁(Open)',
    inputs: 'Open Price',
    target: 'Close Price',
    process:
      'Fits an optimal straight line through historical data points using Ordinary Least Squares (OLS) to minimize sum of squared residual errors between actual and estimated Close values.',
    advantages: [
      'Simple, transparent, and computationally fast',
      'High interpretability with direct linear coefficient slopes',
    ],
    limitations: [
      'Fails to capture non-linear market patterns or multi-feature signals like volume spikes',
    ],
  },
  {
    key: 'multiple_linear',
    name: 'Multiple Linear Regression',
    formula: 'Close = b₀ + b₁(Open) + b₂(High) + b₃(Low) + b₄(Volume)',
    inputs: 'Open, High, Low, Volume',
    target: 'Close Price',
    process:
      'Extends OLS regression into a 4-dimensional feature hyper-plane, learning weights for each market feature to model simultaneous impacts on current day Close.',
    advantages: [
      'Incorporates intraday volatility (High/Low) and liquidity (Volume)',
      'Highly interpretable weights for feature importance',
    ],
    limitations: [
      'Assumes strict linear independence and can suffer from multicollinearity between High and Low',
    ],
  },
  {
    key: 'polynomial',
    name: 'Polynomial Regression (Degree 3)',
    formula: 'Close = b₀ + ∑ bᵢ(Xᵢ) + ∑ cᵢ(Xᵢ²) + ∑ dᵢ(Xᵢ³)',
    inputs: 'Open, High, Low, Volume (Expanded with degree 3 cubic interaction terms)',
    target: 'Close Price',
    process:
      'Applies a non-linear feature transformation to create cubic and quadratic interactions before fitting a linear regression estimator.',
    advantages: [
      'Captures complex non-linear market price trends and cubic momentum acceleration',
      'Achieves extremely high R² accuracy on structured market datasets',
    ],
    limitations: [
      'Higher polynomial degrees can cause overfitting on extreme out-of-distribution values',
    ],
  },
  {
    key: 'svr',
    name: 'Support Vector Regression (SVR - RBF)',
    formula: 'f(x) = ∑ (αᵢ - αᵢ*) K(xᵢ, x) + b',
    inputs: 'Open, High, Low, Volume (Scaled via StandardScaler)',
    target: 'Close Price',
    process:
      'Maps input features into an infinite-dimensional feature space using the Radial Basis Function (RBF) kernel and fits a decision tube bounded by margin tolerance epsilon (ε=0.1).',
    advantages: [
      'Robust against outliers due to the margin tube parameter',
      'Excels at learning complex non-linear boundary relationships',
    ],
    limitations: [
      'Highly sensitive to feature scaling (requires StandardScaler)',
      'Computationally heavier on very large datasets',
    ],
  },
  {
    key: 'random_forest',
    name: 'Random Forest Regressor',
    formula: 'ŷ = (1 / N) ∑ Tᵢ(x)',
    inputs: 'Open, High, Low, Volume (StandardScaler pipeline)',
    target: 'Close Price',
    process:
      'Ensemble algorithm that trains 100 independent decision trees using bootstrap aggregation (bagging) and computes the mean ensemble prediction across all trees.',
    advantages: [
      'Handles non-linear relationships and interactions without rigid parametric assumptions',
      'Resistant to individual tree overfitting',
    ],
    limitations: [
      'Cannot extrapolate predictions beyond the bounds of training data ranges',
    ],
  },
  {
    key: 'gradient_boosting',
    name: 'Gradient Boosting Regressor',
    formula: 'F_m(x) = F_{m-1}(x) + γ_m h_m(x)',
    inputs: 'Open, High, Low, Volume (StandardScaler pipeline)',
    target: 'Close Price',
    process:
      'Sequential boosting algorithm that builds decision trees sequentially, where each new tree models the residual errors (pseudo-residuals) of prior trees to minimize loss.',
    advantages: [
      'Extremely high predictive precision when tuned correctly',
      'Effectively captures subtle non-linear dependencies',
    ],
    limitations: [
      'Sensitive to noisy financial data and prone to overfitting if learning rate or depth is too high',
    ],
  },
];

const AlgorithmExplanations = () => {
  const [expandedKey, setExpandedKey] = useState('linear');

  const toggleExpand = (key) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  return (
    <div className="glass-card explanations-section">
      <div className="section-header">
        <div className="title-with-badge">
          <BookOpen className="section-icon" size={22} />
          <h2>Machine Learning Algorithm Knowledge Hub</h2>
        </div>
        <p className="section-desc">
          Mathematical foundations, training mechanics, advantages, and limitations of all 6 models
        </p>
      </div>

      <div className="accordion-list">
        {ALGORITHMS_DOCS.map((algo) => {
          const isExpanded = expandedKey === algo.key;
          return (
            <div
              key={algo.key}
              className={`accordion-item glass-card ${isExpanded ? 'accordion-open' : ''}`}
            >
              <div className="accordion-header" onClick={() => toggleExpand(algo.key)}>
                <div className="algo-title-meta">
                  <Code2 className="algo-icon" size={18} />
                  <span className="algo-name">{algo.name}</span>
                  <span className="algo-formula-preview">{algo.formula}</span>
                </div>
                <button className="icon-btn">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {isExpanded && (
                <div className="accordion-body">
                  <div className="algo-grid">
                    <div className="algo-info-block">
                      <h5>Mathematical Formula / Representation</h5>
                      <div className="formula-code-box">{algo.formula}</div>
                    </div>

                    <div className="algo-info-block">
                      <h5>Feature Inputs & Target</h5>
                      <p>
                        <strong>Inputs (X):</strong> {algo.inputs}
                        <br />
                        <strong>Target (y):</strong> {algo.target}
                      </p>
                    </div>
                  </div>

                  <div className="algo-info-block margin-top">
                    <h5>Training & Prediction Mechanics</h5>
                    <p>{algo.process}</p>
                  </div>

                  <div className="algo-pros-cons-grid">
                    <div className="pros-box">
                      <div className="pros-title">
                        <CheckCircle2 size={16} /> Key Advantages
                      </div>
                      <ul>
                        {algo.advantages.map((adv, idx) => (
                          <li key={idx}>{adv}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="cons-box">
                      <div className="cons-title">
                        <AlertTriangle size={16} /> Core Limitations
                      </div>
                      <ul>
                        {algo.limitations.map((lim, idx) => (
                          <li key={idx}>{lim}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlgorithmExplanations;

import { useState } from 'react';
import { Calculator, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { predictPolynomial } from '../../services/api';

const PolynomialForm = ({ setPrediction, setOpenPrice, onNavigateToAbout }) => {
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputVal || isNaN(inputVal) || parseFloat(inputVal) <= 0) {
      setError('Please enter a valid positive numeric open price.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await predictPolynomial(inputVal);
      setResult(data);
      setOpenPrice(inputVal);
      setPrediction(data.predicted_close);
    } catch (err) {
      setError(err.message || 'Polynomial Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-form-card glass-panel animate-fade-in">
      <div className="form-header">
        <div className="form-title-group">
          <div className="icon-wrapper">
            <Calculator size={20} color="var(--primary)" />
          </div>
          <div>
            <h3>Polynomial Close Predictor</h3>
            <p>Predict closing price using degree-2 non-linear polynomial features (y = β₀ + β₁ x + β₂ x²).</p>
          </div>
        </div>

        {onNavigateToAbout && (
          <button className="about-link-btn" onClick={() => onNavigateToAbout('polynomial')}>
            <BookOpen size={15} />
            <span>About Polynomial</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-group">
          <label htmlFor="poly-open">Input Opening Price ($):</label>
          <div className="input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              id="poly-open"
              type="number"
              step="0.01"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. 145.50"
              required
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Predicting Polynomial Close...</span>
            </>
          ) : (
            <>
              <span>Predict Close Price</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="result-card glass-panel highlight-border animate-fade-in">
          <div className="result-header">
            <span>Polynomial Predicted Close Price</span>
          </div>
          <div className="result-price">${result.predicted_close.toFixed(2)}</div>
          <div className="result-metrics">
            <div className="metric-item">
              <span className="label">Polynomial Degree:</span>
              <span className="value">{result.details?.degree}</span>
            </div>
            <div className="metric-item">
              <span className="label">Linear term (β₁):</span>
              <span className="value">{result.details?.coefficients?.[1]}</span>
            </div>
            <div className="metric-item">
              <span className="label">Quadratic term (β₂):</span>
              <span className="value">{result.details?.coefficients?.[2]}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolynomialForm;

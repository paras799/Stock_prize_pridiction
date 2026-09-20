import { useState } from 'react';
import { Calculator, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { predictMultipleLinear } from '../../services/api';

const MultipleLinearForm = ({ setPrediction, setOpenPrice, onNavigateToAbout }) => {
  const [openVal, setOpenVal] = useState('');
  const [highVal, setHighVal] = useState('');
  const [lowVal, setLowVal] = useState('');
  const [volumeVal, setVolumeVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!openVal || isNaN(openVal) || parseFloat(openVal) <= 0) {
      setError('Please enter a valid positive numeric open price.');
      return;
    }
    if (!highVal || isNaN(highVal) || parseFloat(highVal) <= 0) {
      setError('Please enter a valid positive numeric high price.');
      return;
    }
    if (!lowVal || isNaN(lowVal) || parseFloat(lowVal) <= 0) {
      setError('Please enter a valid positive numeric low price.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await predictMultipleLinear(openVal, highVal, lowVal, volumeVal || 0);
      setResult(data);
      setOpenPrice(openVal);
      setPrediction(data.predicted_close);
    } catch (err) {
      setError(err.message || 'Multiple Linear Prediction failed.');
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
            <h3>Multiple Linear Close Predictor</h3>
            <p>Predict closing price using Open, High, Low, & Volume indicators.</p>
          </div>
        </div>

        {onNavigateToAbout && (
          <button className="about-link-btn" onClick={() => onNavigateToAbout('multiple-linear')}>
            <BookOpen size={15} />
            <span>About Multiple Linear</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="multi-grid">
          <div className="form-group">
            <label htmlFor="multi-open">Open Price ($):</label>
            <div className="input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                id="multi-open"
                type="number"
                step="0.01"
                value={openVal}
                onChange={(e) => setOpenVal(e.target.value)}
                placeholder="145.50"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="multi-high">High Price ($):</label>
            <div className="input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                id="multi-high"
                type="number"
                step="0.01"
                value={highVal}
                onChange={(e) => setHighVal(e.target.value)}
                placeholder="148.00"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="multi-low">Low Price ($):</label>
            <div className="input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                id="multi-low"
                type="number"
                step="0.01"
                value={lowVal}
                onChange={(e) => setLowVal(e.target.value)}
                placeholder="144.20"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="multi-volume">Volume (Shares):</label>
            <div className="input-wrapper">
              <input
                id="multi-volume"
                type="number"
                value={volumeVal}
                onChange={(e) => setVolumeVal(e.target.value)}
                placeholder="1500000"
              />
            </div>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Predicting Multi-Linear Close...</span>
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
            <span>Multiple Linear Predicted Close Price</span>
          </div>
          <div className="result-price">${result.predicted_close.toFixed(2)}</div>
          <div className="result-metrics">
            <div className="metric-item">
              <span className="label">Open Coef:</span>
              <span className="value">{result.details?.coefficients?.Open}</span>
            </div>
            <div className="metric-item">
              <span className="label">High Coef:</span>
              <span className="value">{result.details?.coefficients?.High}</span>
            </div>
            <div className="metric-item">
              <span className="label">Low Coef:</span>
              <span className="value">{result.details?.coefficients?.Low}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleLinearForm;

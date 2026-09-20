import { TrendingUp, DollarSign } from 'lucide-react';

const PredictionForm = ({ openPrice, setOpenPrice, handlePredict, loading, error, prediction }) => {
  return (
    <section className="glass-panel input-section">
      <div className="section-header">
        <TrendingUp size={24} color="var(--accent)" />
        <h2>Market Prediction</h2>
      </div>
      
      <form onSubmit={handlePredict} className="prediction-form">
        <div className="input-group">
          <label htmlFor="openPrice">Opening Price ($)</label>
          <div className="input-wrapper">
            <DollarSign size={20} className="input-icon" />
            <input
              id="openPrice"
              type="number"
              step="0.01"
              placeholder="e.g. 150.50"
              value={openPrice}
              onChange={(e) => setOpenPrice(e.target.value)}
              required
            />
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className={`predict-btn ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Analyzing Market...' : 'Predict Closing Price'}
        </button>
      </form>

      <div className="prediction-display" style={{ marginTop: '2rem' }}>
        {prediction !== null ? (
          <>
            <p className="label">Predicted Close (Target)</p>
            <h3 className="value">
              <DollarSign size={40} color="var(--success)" />
              {prediction.toFixed(2)}
            </h3>
          </>
        ) : (
          <div className="empty-state">
            <p>Enter an open price to see the predicted closing price.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PredictionForm;

import { Cpu } from 'lucide-react';

const ModelInfo = ({ modelInfo }) => {
  return (
    <section className="glass-panel info-card">
      <div className="section-header">
        <Cpu size={24} color="var(--primary)" />
        <h2>Model Insights</h2>
      </div>
      
      {modelInfo ? (
        modelInfo.status === "Model not loaded" ? (
          <p className="error-text">Model 'svr_model.pkl' is missing. Please run the backend training script.</p>
        ) : (
          <ul className="info-list">
            <li>
              <span className="info-label">Type</span>
              <span className="info-value">{modelInfo.model_type}</span>
            </li>
            <li>
              <span className="info-label">Kernel</span>
              <span className="info-value">{modelInfo.kernel}</span>
            </li>
            <li>
              <span className="info-label">C (Regularization)</span>
              <span className="info-value">{modelInfo.C}</span>
            </li>
            <li>
              <span className="info-label">Epsilon</span>
              <span className="info-value">{modelInfo.epsilon}</span>
            </li>
            <li>
              <span className="info-label">Gamma</span>
              <span className="info-value">{modelInfo.gamma}</span>
            </li>
          </ul>
        )
      ) : (
        <p>Loading model details...</p>
      )}
    </section>
  );
};

export default ModelInfo;

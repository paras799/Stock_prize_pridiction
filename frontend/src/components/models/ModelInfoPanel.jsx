import { CheckCircle2, Cpu, FileCode } from 'lucide-react';

const ModelInfoPanel = ({ modelInfo }) => {
  if (!modelInfo) {
    return (
      <div className="model-info-card glass-panel">
        <p className="loading-text">Loading model configuration...</p>
      </div>
    );
  }

  return (
    <div className="model-info-card glass-panel animate-fade-in">
      <div className="info-header">
        <Cpu size={20} color="var(--primary)" />
        <h3>Model Architecture Parameters</h3>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Model Type:</span>
          <span className="info-value highlight">{modelInfo.model_type}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Target Signal:</span>
          <span className="info-value">Stock <code>{modelInfo.target}</code> Price</span>
        </div>

        <div className="info-item">
          <span className="info-label">Input Features:</span>
          <div className="features-tags">
            {modelInfo.features_used?.map((f, i) => (
              <span key={i} className="feature-tag">
                <CheckCircle2 size={12} /> {f}
              </span>
            ))}
          </div>
        </div>

        {modelInfo.formula && (
          <div className="info-item full-width">
            <span className="info-label">Fitted Formula:</span>
            <div className="formula-box">
              <FileCode size={14} color="var(--primary)" />
              <code>{modelInfo.formula}</code>
            </div>
          </div>
        )}

        {modelInfo.kernel && (
          <div className="info-item">
            <span className="info-label">Kernel Function:</span>
            <span className="info-value">{modelInfo.kernel.toUpperCase()}</span>
          </div>
        )}

        {modelInfo.C !== undefined && (
          <div className="info-item">
            <span className="info-label">C Penalty Parameter:</span>
            <span className="info-value">{modelInfo.C}</span>
          </div>
        )}

        {modelInfo.scaler_mean !== undefined && (
          <div className="info-item">
            <span className="info-label">Scaler Mean (μ):</span>
            <span className="info-value">{modelInfo.scaler_mean}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelInfoPanel;

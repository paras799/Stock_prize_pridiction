import React from 'react';
import WorkflowDiagram from './WorkflowDiagram';
import MathFormula from './MathFormula';
import {
  BookOpen,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  BarChart2,
  ShieldAlert,
} from 'lucide-react';

const AboutModelSection = ({ model }) => {
  if (!model) return null;

  return (
    <div className="about-model-container">
      {/* 1. What is this model? */}
      <section className="about-section-card">
        <div className="section-title-header">
          <BookOpen className="section-title-icon" size={20} />
          <h3>1. What is this model?</h3>
        </div>
        <p className="section-body-text">{model.whatIs}</p>
      </section>

      {/* 2. How does it work? */}
      <section className="about-section-card">
        <div className="section-title-header">
          <Cpu className="section-title-icon" size={20} />
          <h3>2. How does it work?</h3>
        </div>
        <div className="process-steps-list">
          {model.howItWorks.map((item) => (
            <div key={item.step} className="process-step-box">
              <span className="step-num">{item.step}</span>
              <div>
                <h4 className="process-step-title">{item.title}</h4>
                <p className="process-step-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Mathematical Concept */}
      <section className="about-section-card">
        <div className="section-title-header">
          <Layers className="section-title-icon" size={20} />
          <h3>3. Mathematical Concept</h3>
        </div>
        <p className="section-intro">
          The underlying mathematical formula that governs prediction calculations:
        </p>
        <MathFormula
          latex={model.mathConcept.latex}
          fallbackText={model.mathConcept.equation}
          title={`${model.name} — Formal Equation`}
        />

        <div className="math-terms-table">
          <h4 className="terms-heading">Parameter & Variable Descriptions:</h4>
          <div className="terms-grid">
            {model.mathConcept.terms.map((term, idx) => (
              <div key={idx} className="term-card">
                <span className="term-symbol">{term.symbol}</span>
                <span className="term-desc">{term.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Used */}
      <section className="about-section-card">
        <div className="section-title-header">
          <Layers className="section-title-icon" size={20} />
          <h3>4. Features Used</h3>
        </div>
        <p className="section-intro">
          This model utilizes the following verified features from our dataset:
        </p>
        <div className="features-explanation-grid">
          {model.featuresExplanation.map((f) => (
            <div key={f.name} className="feature-info-card">
              <span className="feature-name-badge">{f.name}</span>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Training Process */}
      <section className="about-section-card">
        <div className="section-title-header">
          <Cpu className="section-title-icon" size={20} />
          <h3>5. Training Process</h3>
        </div>
        <div className="training-specs-grid">
          <div className="spec-card">
            <span className="spec-label">Train / Test Split</span>
            <span className="spec-val">{model.trainingProcess.split}</span>
          </div>
          <div className="spec-card">
            <span className="spec-label">Preprocessing & Scaling</span>
            <span className="spec-val">{model.trainingProcess.preprocessing}</span>
          </div>
          <div className="spec-card">
            <span className="spec-label">Algorithm Implementation</span>
            <span className="spec-val">{model.trainingProcess.algorithm}</span>
          </div>
          <div className="spec-card">
            <span className="spec-label">Validation Method</span>
            <span className="spec-val">{model.trainingProcess.validation}</span>
          </div>
        </div>
      </section>

      {/* 6. Evaluation Metrics */}
      <section className="about-section-card">
        <div className="section-title-header">
          <BarChart2 className="section-title-icon" size={20} />
          <h3>6. Evaluation Metrics</h3>
        </div>
        <div className="metrics-explanation-list">
          <div className="metric-explain-box">
            <span className="metric-name">MAE (Mean Absolute Error)</span>
            <p>{model.metrics.mae}</p>
          </div>
          <div className="metric-explain-box">
            <span className="metric-name">RMSE (Root Mean Squared Error)</span>
            <p>{model.metrics.rmse}</p>
          </div>
          <div className="metric-explain-box">
            <span className="metric-name">R² Score (Coefficient of Determination)</span>
            <p>{model.metrics.r2}</p>
          </div>
          <div className="metric-explain-box">
            <span className="metric-name">MAPE (Mean Absolute Percentage Error)</span>
            <p>{model.metrics.mape}</p>
          </div>
        </div>
      </section>

      {/* 7. Advantages */}
      <section className="about-section-card">
        <div className="section-title-header">
          <CheckCircle2 className="section-title-icon text-success" size={20} />
          <h3>7. Advantages</h3>
        </div>
        <ul className="advantages-list">
          {model.advantages.map((adv, idx) => (
            <li key={idx}>
              <CheckCircle2 size={16} className="advantage-check-icon" />
              <span>{adv}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 8. Limitations & Risk Disclaimer */}
      <section className="about-section-card warning-card">
        <div className="section-title-header">
          <AlertTriangle className="section-title-icon text-warning" size={20} />
          <h3>8. Limitations & Financial Risk</h3>
        </div>
        <ul className="limitations-list">
          {model.limitations.map((lim, idx) => (
            <li key={idx}>
              <AlertTriangle size={16} className="limitation-alert-icon" />
              <span>{lim}</span>
            </li>
          ))}
        </ul>
        <div className="disclaimer-callout">
          <ShieldAlert size={18} className="callout-icon" />
          <p>
            <strong>Important Notice:</strong> Financial stock markets are inherently unpredictable, influenced by global economic events, news, and investor sentiment. This model provides statistical predictions based on historical patterns and <strong>DOES NOT guarantee future prices or trading profits</strong>.
          </p>
        </div>
      </section>

      {/* 9. Prediction Workflow */}
      <section className="about-section-card">
        <div className="section-title-header">
          <Cpu className="section-title-icon" size={20} />
          <h3>9. Prediction Workflow</h3>
        </div>
        <WorkflowDiagram title={`Prediction Pipeline for ${model.name}`} />
      </section>
    </div>
  );
};

export default AboutModelSection;
